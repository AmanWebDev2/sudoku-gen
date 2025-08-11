import { NextRequest, NextResponse } from 'next/server';
import { generateSudoku } from '../../../../src/index';

export async function POST(request: NextRequest) {
  try {
    const { size, difficulty } = await request.json();
    
    // Validate inputs
    if (![4, 6, 9].includes(size)) {
      return NextResponse.json({ error: 'Invalid size' }, { status: 400 });
    }
    
    if (!['easy', 'medium', 'hard'].includes(difficulty)) {
      return NextResponse.json({ error: 'Invalid difficulty' }, { status: 400 });
    }
    
    const puzzle = generateSudoku(size, difficulty);
    
    return NextResponse.json(puzzle);
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json({ error: 'Failed to generate puzzle' }, { status: 500 });
  }
}