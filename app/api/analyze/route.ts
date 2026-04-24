import { NextRequest, NextResponse } from 'next/server';
import { AudioAnalyzer } from '@/lib/ai/AudioAnalyzer';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Bisa dari file upload atau dari URL yang sudah di-fetch di client
    const file = formData.get('audio') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'File audio tidak ditemukan dalam request' }, { status: 400 });
    }

    const mimeType = file.type;
    if (!mimeType.includes('audio/')) {
       return NextResponse.json({ error: 'File yang diunggah bukan format audio yang valid' }, { status: 400 });
    }

    // Convert file ke Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Inisialisasi Analyzer dan proses
    const analyzer = new AudioAnalyzer();
    const result = await analyzer.analyze(buffer, mimeType);

    return NextResponse.json({
      status: 'success',
      result: result // 'Asli' | 'Deepfake'
    });

  } catch (error: any) {
    console.error('[API Analyze] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Terjadi kesalahan saat memproses audio' },
      { status: 500 }
    );
  }
}
