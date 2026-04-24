import { AudioAnalysisStrategy } from './AudioAnalysisStrategy';
import { HfInference } from '@huggingface/inference';

export class HuggingFaceStrategy implements AudioAnalysisStrategy {
  private modelId: string;
  private token: string;
  private hf: HfInference;

  constructor() {
    this.modelId = process.env.HF_MODEL_ID || 'MelodyMachine/Deepfake-audio-detection-V2';
    this.token = process.env.HF_TOKEN || '';
    
    if (!this.token) {
      console.warn('HF_TOKEN tidak ditemukan di environment variables!');
    }

    this.hf = new HfInference(this.token);
  }

  async analyze(audioBuffer: Buffer, mimeType: string): Promise<'Asli' | 'Deepfake'> {
    console.log(`[HuggingFaceStrategy] Menganalisis audio dengan model ${this.modelId}...`);
    
    try {
      const result = await this.hf.audioClassification({
        model: this.modelId,
        data: new Blob([new Uint8Array(audioBuffer)], { type: mimeType }),
      });

      console.log('[HuggingFaceStrategy] Hasil:', result);

      if (Array.isArray(result) && result.length > 0) {
        // Ambil probabilitas tertinggi
        const topPrediction = result[0];
        const label = topPrediction.label.toLowerCase();
        
        // Sesuaikan dengan label model. Asumsi: 'fake' atau 'spoof' atau 'ai' artinya Deepfake.
        if (label.includes('fake') || label.includes('spoof') || label.includes('ai')) {
          return 'Deepfake';
        } else {
          return 'Asli';
        }
      }

      throw new Error('Format respons model Hugging Face tidak dikenali.');
    } catch (error) {
      console.error('[HuggingFaceStrategy] Error:', error);
      throw error;
    }
  }
}
