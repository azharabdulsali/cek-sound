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
ALLOWED_EXTENSIONS = {'mp3', 'wav', 'flac', 'ogg', 'webm', 'm4a', 'mp4'}
# MIME types tambahan yang diterima (khususnya dari Expo/React Native)
ALLOWED_MIME_TYPES = {
    'audio/mp4', 'audio/m4a', 'audio/x-m4a',
    'audio/mpeg', 'audio/wav', 'audio/flac',
    'audio/ogg', 'audio/webm',
}
# Format yang memerlukan konversi ke WAV sebelum analisis ONNX/librosa
NEEDS_CONVERSION = {'m4a', 'mp4'}

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



def convert_to_wav(src_path: str) -> str:
    """
    Konversi file audio (m4a, mp4, dll.) ke WAV 16kHz mono menggunakan ffmpeg.
    Mengembalikan path file WAV sementara.
    Melempar RuntimeError jika ffmpeg tidak tersedia atau konversi gagal.
    """
    import subprocess
    import shutil

    if shutil.which('ffmpeg') is None:
        raise RuntimeError(
            'ffmpeg tidak ditemukan di PATH. Pastikan ffmpeg sudah terinstall '
            'dan dapat diakses dari terminal.'
        )

    with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as tmp_wav:
        wav_path = tmp_wav.name

    try:
        result = subprocess.run(
            [
                'ffmpeg', '-y',          # overwrite tanpa tanya
                '-i', src_path,          # input
                '-ac', '1',              # mono
                '-ar', '16000',          # 16 kHz
                '-f', 'wav',             # format output
                wav_path
            ],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            timeout=60,
        )
        if result.returncode != 0:
            stderr_msg = result.stderr.decode('utf-8', errors='replace').strip()
            raise RuntimeError(
                f'ffmpeg gagal mengkonversi file (exit code {result.returncode}): {stderr_msg[-500:]}'
            )
    except subprocess.TimeoutExpired:
        raise RuntimeError('ffmpeg timeout setelah 60 detik saat mengkonversi file.')

    return wav_path


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

    # Periksa MIME type sebagai fallback jika ekstensi tidak dikenal
    # (berguna untuk file dari Expo yang mungkin pakai MIME audio/mp4)
    content_type = (f.content_type or '').lower().split(';')[0].strip()
    if ext not in ALLOWED_EXTENSIONS:
        if content_type in ALLOWED_MIME_TYPES:
            # Mapping MIME → ekstensi
            mime_to_ext = {
                'audio/mp4': 'm4a',
                'audio/m4a': 'm4a',
                'audio/x-m4a': 'm4a',
                'audio/mpeg': 'mp3',
                'audio/wav': 'wav',
                'audio/flac': 'flac',
                'audio/ogg': 'ogg',
                'audio/webm': 'webm',
            }
            ext = mime_to_ext.get(content_type, ext)
        else:
            return jsonify({'error': f'Format .{ext} tidak didukung. Format yang didukung: mp3, wav, flac, ogg, webm, m4a.'}), 400

    # Simpan file ke temp storage
    with tempfile.NamedTemporaryFile(suffix=f'.{ext}', delete=False) as tmp:
        f.save(tmp.name)
        tmp_path = tmp.name

    # Path file WAV hasil konversi (None jika tidak perlu konversi)
    converted_wav_path = None

    try:
        # Konversi m4a/mp4 → WAV sebelum analisis
        if ext in NEEDS_CONVERSION:
            try:
                converted_wav_path = convert_to_wav(tmp_path)
                analysis_path = converted_wav_path
            except RuntimeError as conv_err:
                return jsonify({'error': str(conv_err)}), 500
        else:
            analysis_path = tmp_path

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
                # Gunakan file WAV hasil konversi jika tersedia (agar Resemble menerima format yang valid)
                upload_path = converted_wav_path if converted_wav_path else tmp_path
                file_ext = os.path.splitext(upload_path)[1]
                unique_filename = f"{uuid.uuid4()}{file_ext}"
                upload_mime = 'audio/wav' if converted_wav_path else 'audio/mpeg'
                
                with open(upload_path, 'rb') as audio_f:
                    supabase_client.storage.from_('audio_temp').upload(
                        file=audio_f.read(),
                        path=unique_filename,
                        file_options={"content-type": upload_mime}
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

            # Preprocessing (gunakan analysis_path: WAV hasil konversi jika ada)
            input_data = preprocess(analysis_path)
            
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
        # Bersihkan semua file temp
        if tmp_path and os.path.exists(tmp_path):
            os.unlink(tmp_path)
        if converted_wav_path and os.path.exists(converted_wav_path):
            os.unlink(converted_wav_path)

if __name__ == '__main__':
    app.run(debug=True, port=5328)
