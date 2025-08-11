import { NextRequest, NextResponse } from 'next/server';
import { toPDF } from '../../../../../src/index';

export async function POST(request: NextRequest) {
  try {
    const { grid, options, solution } = await request.json();
    
    const pdfBuffer = await toPDF(grid, options, solution);
    
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${options.title || 'sudoku'}.pdf"`,
      },
    });
  } catch (error) {
    console.error('PDF export error:', error);
    return NextResponse.json({ error: 'Failed to export PDF' }, { status: 500 });
  }
}