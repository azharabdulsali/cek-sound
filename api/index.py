import os
import tempfile
from pathlib import Path
import numpy as np
import librosa
import onnxruntime as ort
from flask import Flask, request, jsonify

# ── Config ──────────────────────────────────────────────────
TARGET_SR, PRE_EMPH  = 16000, 0.97
N_FFT, HOP_LENGTH    = 2048, 512
WIN_LENGTH, N_MELS   = 2048, 128
FMIN, FMAX, MAX_FRAMES = 0, 8000, 400
ALLOWED_EXTENSIONS = {'mp3', 'wav', 'flac', 'ogg'}

# Path relatif terhadap file ini (api/index.py)
MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', 'models', 'model.onnx')

app = Flask(__name__)

# Inisialisasi Sesi ONNX secara global agar tetap tersimpan di memori saat hot-start
# (Ini menghemat waktu loading saat ada permintaan berurutan)
session = None
try:
    if os.path.exists(MODEL_PATH):
        session = ort.InferenceSession(MODEL_PATH)
        print("ONNX Model loaded successfully.")
    else:
        print(f"Warning: ONNX model not found at {MODEL_PATH}")
except Exception as e:
    print(f"Failed to load ONNX model: {e}")


def preprocess(path):
    # 1. Load Audio
    y, sr = librosa.load(path, sr=TARGET_SR, mono=True)
    
    # 2. Peak Normalization
    peak = np.max(np.abs(y))
    if peak > 1e-8: y /= peak
    
    # 3. Pre-emphasis
    y = np.append(y[0], y[1:] - PRE_EMPH * y[:-1])
    
    # 4. Mel Spectrogram
    mel = librosa.feature.melspectrogram(
        y=y, sr=sr, n_fft=N_FFT, hop_length=HOP_LENGTH,
        win_length=WIN_LENGTH, window='hamming',
        n_mels=N_MELS, fmin=FMIN, fmax=FMAX
    )
    
    # 5. Power to DB
    log_mel = librosa.power_to_db(mel, ref=np.max)
    
    # 6. Pad/Crop ke 400 frames
    T = log_mel.shape[1]
    if T < MAX_FRAMES:
        log_mel = np.pad(log_mel, ((0,0),(0,MAX_FRAMES-T)), constant_values=log_mel.min())
    else:
        log_mel = log_mel[:, :MAX_FRAMES]
        
    # Return as float16 numpy array with shape [1, 1, 128, 400]
    tensor_data = log_mel.astype(np.float16)
    tensor_data = np.expand_dims(tensor_data, axis=0) # tambah batch
    tensor_data = np.expand_dims(tensor_data, axis=0) # tambah channel
    return tensor_data


@app.route('/api/analyze', methods=['POST'])
def analyze():
    if session is None:
        return jsonify({'error': 'Model ONNX belum dimuat di server.'}), 500

    if 'audio' not in request.files:
        return jsonify({'error': 'File audio tidak ditemukan dalam request.'}), 400
        
    f = request.files['audio']
    if f.filename == '':
        return jsonify({'error': 'Nama file kosong.'}), 400

    ext = Path(f.filename).suffix[1:].lower()
    if ext not in ALLOWED_EXTENSIONS:
        return jsonify({'error': f'Format .{ext} tidak didukung.'}), 400

    # Simpan file ke temp storage
    with tempfile.NamedTemporaryFile(suffix=f'.{ext}', delete=False) as tmp:
        f.save(tmp.name)
        tmp_path = tmp.name

    try:
        # Preprocessing
        input_data = preprocess(tmp_path)
        
        # ONNX Inference
        input_name = session.get_inputs()[0].name
        output_name = session.get_outputs()[0].name
        
        results = session.run([output_name], {input_name: input_data})
        output_data = results[0][0] # Bentuk array 1D
        
        # Probabilitas: Asumsi index 0 = Asli, index 1 = Deepfake
        prob_asli = float(output_data[0])
        prob_deepfake = float(output_data[1])
        
        is_deepfake = prob_deepfake > prob_asli
        result_label = 'Deepfake' if is_deepfake else 'Asli'

        return jsonify({
            'result': result_label,
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
    app.run(debug=True, port=5000)
