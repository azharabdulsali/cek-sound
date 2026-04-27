import os
import tempfile
from pathlib import Path
import requests

try:
    import numpy as np
    import librosa
    import onnxruntime as ort
    ONNX_AVAILABLE = True
except ImportError:
    ONNX_AVAILABLE = False

from flask import Flask, request, jsonify
from dotenv import load_dotenv

# Load env variables
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env.local'))

# ── Config ──────────────────────────────────────────────────
TARGET_SR = 16000
ALLOWED_EXTENSIONS = {'mp3', 'wav', 'flac', 'ogg', 'webm'}

# Path relatif terhadap file ini (api/analyze.py)
MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', 'models', 'model.onnx')

app = Flask(__name__)

# Inisialisasi Sesi ONNX secara global agar tetap tersimpan di memori saat hot-start
session = None
if ONNX_AVAILABLE:
    try:
        if os.path.exists(MODEL_PATH):
            session = ort.InferenceSession(MODEL_PATH)
            print("ONNX Model loaded successfully.")
        else:
            print(f"Warning: ONNX model not found at {MODEL_PATH}")
    except Exception as e:
        print(f"Failed to load ONNX model: {e}")



def preprocess(path):
    # 1. Load Audio at 16000 Hz
    y, sr = librosa.load(path, sr=TARGET_SR, mono=True)
    
    # 2. Normalize (zero mean, unit variance) seperti yang dibutuhkan Wav2Vec2
    y = (y - np.mean(y)) / np.sqrt(np.var(y) + 1e-7)
        
    # 3. Return as float32 numpy array with shape [1, sequence_length]
    tensor_data = y.astype(np.float32)
    tensor_data = np.expand_dims(tensor_data, axis=0)  # tambah batch
    return tensor_data


@app.route('/', defaults={'path': ''}, methods=['POST', 'GET'])
@app.route('/<path:path>', methods=['POST', 'GET'])
def analyze(path):
    if request.method == 'GET':
        return jsonify({'message': 'Audio Analysis API is running. Send a POST request with an audio file.'}), 200

    ai_strategy = os.environ.get('AI_STRATEGY', 'onnx')

    if 'audio' not in request.files:
        return jsonify({'error': 'File audio tidak ditemukan dalam request.'}), 400
        
    f = request.files['audio']
    original_filename = f.filename or 'audio.mp3'
    
    if original_filename == '':
        return jsonify({'error': 'Nama file kosong.'}), 400

    ext = Path(original_filename).suffix[1:].lower()
    if ext not in ALLOWED_EXTENSIONS:
        return jsonify({'error': f'Format .{ext} tidak didukung.'}), 400

    # Simpan file ke temp storage
    with tempfile.NamedTemporaryFile(suffix=f'.{ext}', delete=False) as tmp:
        f.save(tmp.name)
        tmp_path = tmp.name

    try:
        if ai_strategy == 'resemble':
            # ── Strategi: Resemble AI Detect ──
            import time
            from resemble import Resemble
            
            resemble_key = os.environ.get('RESEMBLE_API_KEY')
            if not resemble_key or resemble_key == 'tulis_api_key_resemble_anda_disini':
                return jsonify({'error': 'Kredensial Resemble AI belum diatur di .env.local'}), 500
                
            Resemble.api_key(resemble_key)
            
            try:
                # 1. Upload ke Supabase Storage (audio_temp) untuk dapat public URL HTTPS
                from supabase import create_client
                import uuid
                
                supabase_url = os.environ.get('NEXT_PUBLIC_SUPABASE_URL')
                supabase_key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
                if not supabase_url or not supabase_key:
                    return jsonify({'error': 'Kredensial Supabase belum diatur di .env.local'}), 500
                    
                supabase_client = create_client(supabase_url, supabase_key)
                
                # Buat nama file unik
                file_ext = os.path.splitext(tmp_path)[1]
                unique_filename = f"{uuid.uuid4()}{file_ext}"
                
                with open(tmp_path, 'rb') as audio_f:
                    supabase_client.storage.from_('audio_temp').upload(
                        file=audio_f.read(),
                        path=unique_filename,
                        file_options={"content-type": "audio/mpeg"}
                    )
                
                # Dapatkan public URL
                public_url = supabase_client.storage.from_('audio_temp').get_public_url(unique_filename)
                
                # 2. Kirim URL Publik ke Resemble
                detection = Resemble.v2.deepfake_detection.detect(url=public_url)
                
                # Fungsi untuk menghapus file dari Supabase
                def cleanup_supabase():
                    try:
                        supabase_client.storage.from_('audio_temp').remove([unique_filename])
                    except Exception:
                        pass
                        
                if not detection.get('success'):
                    cleanup_supabase()
                    return jsonify({'error': f"Resemble API Error: {detection.get('message', 'Unknown error')}"}), 500
                    
                job_uuid = detection['item']['uuid']
                
                # 3. Polling sampai analisis selesai
                max_retries = 30
                result = None
                for _ in range(max_retries):
                    status_res = Resemble.v2.deepfake_detection.get(job_uuid)
                    if not status_res.get('success'):
                        cleanup_supabase()
                        return jsonify({'error': f"Resemble API Status Error: {status_res.get('message', 'Unknown error')}"}), 500
                        
                    status = status_res['item']['status']
                    if status == 'completed':
                        result = status_res['item']
                        break
                    elif status in ['failed', 'error']:
                        cleanup_supabase()
                        return jsonify({'error': 'Resemble AI gagal memproses audio ini.'}), 500
                        
                    time.sleep(1)
                    
                if not result:
                    cleanup_supabase()
                    return jsonify({'error': 'Timeout menunggu respons dari Resemble AI.'}), 500
                    
                # 4. Ambil hasil dari Resemble
                metrics = result.get('metrics', {})
                prob_deepfake = float(metrics.get('aggregated_score', 0.0))
                prob_asli = 1.0 - prob_deepfake
                
                resemble_label = str(metrics.get('label', '')).lower()
                is_deepfake = resemble_label == 'fake' or prob_deepfake > 0.5
                result_label = 'Deepfake' if is_deepfake else 'Asli'
                
                return jsonify({
                    'result': result_label,
                    'audio_url': public_url,
                    'filename': original_filename,
                    'details': {
                        'prob_asli': prob_asli,
                        'prob_deepfake': prob_deepfake,
                        'raw_resemble': result
                    }
                })
            except Exception as e:
                try:
                    cleanup_supabase()
                except Exception:
                    pass
                return jsonify({'error': f'Terjadi kesalahan saat memanggil Resemble AI: {str(e)}'}), 500
                
        else:
            # ── Strategi Default: ONNX (Model Lokal) ──
            if not ONNX_AVAILABLE:
                return jsonify({'error': 'Library ONNX/Librosa tidak terinstall di environment ini (Vercel). Silakan gunakan strategi Resemble.'}), 500

            if session is None:
                return jsonify({'error': 'Model ONNX belum dimuat di server.'}), 500

            # Preprocessing
            input_data = preprocess(tmp_path)
            
            # ONNX Inference
            input_name = session.get_inputs()[0].name
            output_name = session.get_outputs()[0].name
            
            results = session.run([output_name], {input_name: input_data})
            output_data = results[0][0]  # Bentuk array 1D
            
            # Mengubah logits menjadi probabilitas dengan Softmax
            exp_logits = np.exp(output_data - np.max(output_data))
            probs = exp_logits / exp_logits.sum()
            
            # Berdasarkan id2label di config.json: 0 = "fake", 1 = "real"
            prob_deepfake = float(probs[0])
            prob_asli = float(probs[1])
            
            is_deepfake = prob_deepfake > prob_asli
            result_label = 'Deepfake' if is_deepfake else 'Asli'

            return jsonify({
                'result': result_label,
                'filename': original_filename,
                'details': {
                    'prob_asli': prob_asli,
                    'prob_deepfake': prob_deepfake
                }
            })
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        # Bersihkan file temp
        if os.path.exists(tmp_path):
            os.unlink(tmp_path)

if __name__ == '__main__':
    app.run(debug=True, port=5328)
