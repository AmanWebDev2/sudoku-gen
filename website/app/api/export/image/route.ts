import { NextRequest, NextResponse } from 'next/server';
import { toImage } from '../../../../../src/index';

export async function POST(request: NextRequest) {
  try {
    const { grid, options, solution } = await request.json();
    
    const imageBuffer = toImage(grid, options, solution);
    
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `attachment; filename="${options.filename || 'sudoku'}.png"`,
      },
    });
  } catch (error) {
    console.error('Image export error:', error);
    return NextResponse.json({ error: 'Failed to export image' }, { status: 500 });
  }
}