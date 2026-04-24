import { AudioAnalysisStrategy } from './AudioAnalysisStrategy';
import { HuggingFaceStrategy } from './HuggingFaceStrategy';
import { OnnxStrategy } from './OnnxStrategy';

export class AudioAnalyzer {
  private strategy: AudioAnalysisStrategy;

  constructor() {
    const strategyType = process.env.AI_STRATEGY || 'huggingface';

    console.log(`[AudioAnalyzer] Menginisialisasi strategi AI: ${strategyType}`);

    if (strategyType === 'nextjs_onnx' || strategyType === 'flask_onnx' || strategyType === 'local_onnx') {
      this.strategy = new OnnxStrategy();
    } else {
      // Default to Hugging Face
      this.strategy = new HuggingFaceStrategy();
    }
  }

  /**
   * Menjalankan analisis menggunakan strategi yang dipilih
   */
  async analyze(audioBuffer: Buffer, mimeType: string): Promise<'Asli' | 'Deepfake'> {
    if (!this.strategy) {
      throw new Error('Strategi AI tidak dikonfigurasi dengan benar.');
    }
    
    return await this.strategy.analyze(audioBuffer, mimeType);
  }
}
