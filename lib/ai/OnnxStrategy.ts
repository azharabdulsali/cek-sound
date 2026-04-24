import { AudioAnalysisStrategy } from './AudioAnalysisStrategy';
import * as ort from 'onnxruntime-node';
import path from 'path';
import fs from 'fs';

export class OnnxStrategy implements AudioAnalysisStrategy {
  private modelPath: string;

  constructor() {
    // Path resolusi: relatif dari root folder project
    this.modelPath = process.env.ONNX_MODEL_PATH || './models/model.onnx';
  }

  async analyze(audioBuffer: Buffer, mimeType: string): Promise<'Asli' | 'Deepfake'> {
    console.log(`[OnnxStrategy] Memuat model ONNX dari ${this.modelPath}...`);
    
    const absolutePath = path.resolve(process.cwd(), this.modelPath);
    if (!fs.existsSync(absolutePath)) {
      throw new Error(`File model ONNX tidak ditemukan di path: ${absolutePath}`);
    }

    try {
      // 1. Buat sesi ONNX Runtime
      const session = await ort.InferenceSession.create(absolutePath);

      // 2. Preprocessing Audio (DUMMY)
      // PERHATIAN: Bagian ini harus disesuaikan dengan bagaimana model ONNX Anda dilatih.
      // Jika model menerima MFCC, Anda harus mengekstrak MFCC dari audioBuffer.
      // Jika menerima raw waveform, Anda harus decode audio menjadi Float32Array.
      // Sebagai template, kita buat dummy tensor array.
      console.warn('[OnnxStrategy] Peringatan: Preprocessing audio masih menggunakan dummy data. Sesuaikan dengan model Anda.');
      
      // PENTING: Model Anda ternyata mengharapkan Tensor 4D (Rank 4), bukan 2D.
      // Biasanya ini adalah format [batch_size, channels, height, width] seperti [1, 1, 128, 128]
      // Anda HARUS mengganti ukuran ini sesuai dengan ekstraksi fitur audio Anda (misal: Mel Spectrogram).
      const inputShape = [1, 1, 128, 400]; // Shape dummy 4D sesuai harapan model
      const totalElements = inputShape.reduce((a, b) => a * b);
      const inputData = new Uint16Array(totalElements).fill(0); // Dummy data

      // 3. Eksekusi Model
      // Kita menggunakan "duck typing" objek untuk memotong bug kompilasi 'instanceof' di Next.js
      const tensor = {
        type: 'float16',
        data: inputData,
        dims: inputShape,
        size: totalElements,
        location: 'cpu'
      } as any;

      const feeds: Record<string, ort.Tensor> = {};
      feeds[session.inputNames[0]] = tensor;

      const results = await session.run(feeds);
      
      // 4. Postprocessing Output
      const outputTensor = results[session.outputNames[0]];
      const outputData = outputTensor.data as Float32Array;
      
      console.log('[OnnxStrategy] Raw Output:', outputData);

      // Asumsi output adalah probabilitas [asli, deepfake] atau single float.
      // Silakan sesuaikan logika ini dengan output layer model Anda.
      const isDeepfake = outputData[0] > 0.5; // Contoh logika threshold

      return isDeepfake ? 'Deepfake' : 'Asli';

    } catch (error) {
      console.error('[OnnxStrategy] Error saat menjalankan ONNX:', error);
      throw error;
    }
  }
}
