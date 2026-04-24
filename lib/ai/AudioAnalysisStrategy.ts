export interface AudioAnalysisStrategy {
  /**
   * Mengukur/menganalisis file audio dan mengembalikan prediksi.
   * @param audioBuffer Buffer file audio
   * @param mimeType Mime type (e.g. 'audio/mpeg', 'audio/wav')
   * @returns 'Asli' jika audio natural, 'Deepfake' jika AI-generated
   */
  analyze(audioBuffer: Buffer, mimeType: string): Promise<'Asli' | 'Deepfake'>;
}
