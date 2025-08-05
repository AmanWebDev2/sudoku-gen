import { generateSudoku, toPDF } from './index';

describe('generateSudoku', () => {
  it('should generate a 9x9 grid', () => {
    const sudoku = generateSudoku(9, 'easy');
    expect(sudoku.grid.length).toBe(9);
    expect(sudoku.grid[0].length).toBe(9);
  });

  it('should generate a 4x4 grid', () => {
    const sudoku = generateSudoku(4, 'easy');
    expect(sudoku.grid.length).toBe(4);
    expect(sudoku.grid[0].length).toBe(4);
  });

  it('should generate a 6x6 grid', () => {
    const sudoku = generateSudoku(6, 'easy');
    expect(sudoku.grid.length).toBe(6);
    expect(sudoku.grid[0].length).toBe(6);
  });

  it('should have a valid number of empty cells for easy difficulty', () => {
    const sudoku = generateSudoku(9, 'easy');
    const emptyCells = sudoku.grid.flat().filter((cell) => cell === 0).length;
    expect(emptyCells).toBeGreaterThan(0);
  });
});

describe('toPDF', () => {
  const testGrid = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
  ];

  it('should generate a PDF with default options', async () => {
    const pdfBytes = await toPDF(testGrid);
    expect(pdfBytes).toBeInstanceOf(Uint8Array);
    expect(pdfBytes.length).toBeGreaterThan(0);
  });

  it('should generate a PDF with light theme', async () => {
    const pdfBytes = await toPDF(testGrid, { theme: 'light' });
    expect(pdfBytes).toBeInstanceOf(Uint8Array);
    expect(pdfBytes.length).toBeGreaterThan(0);
  });

  it('should generate a PDF with dark theme', async () => {
    const pdfBytes = await toPDF(testGrid, { theme: 'dark' });
    expect(pdfBytes).toBeInstanceOf(Uint8Array);
    expect(pdfBytes.length).toBeGreaterThan(0);
  });

  it('should generate a PDF with custom theme', async () => {
    const customTheme = {
      background: '#f0f0f0',
      gridColor: '#333333',
      textColor: '#000000',
      boxLineColor: '#666666'
    };
    const pdfBytes = await toPDF(testGrid, { theme: customTheme });
    expect(pdfBytes).toBeInstanceOf(Uint8Array);
    expect(pdfBytes.length).toBeGreaterThan(0);
  });

  it('should generate a PDF with custom metadata', async () => {
    const pdfBytes = await toPDF(testGrid, {
      title: 'Custom Sudoku',
      author: 'Test Author',
      subject: 'Test Subject',
      keywords: 'test, sudoku'
    });
    expect(pdfBytes).toBeInstanceOf(Uint8Array);
    expect(pdfBytes.length).toBeGreaterThan(0);
  });


  it('should work with 4x4 grid', async () => {
    const smallGrid = [
      [1, 0, 3, 0],
      [0, 3, 0, 1],
      [3, 0, 1, 0],
      [0, 1, 0, 3]
    ];
    const pdfBytes = await toPDF(smallGrid);
    expect(pdfBytes).toBeInstanceOf(Uint8Array);
    expect(pdfBytes.length).toBeGreaterThan(0);
  });

  it('should work with 6x6 grid', async () => {
    const mediumGrid = [
      [1, 0, 3, 0, 5, 0],
      [0, 3, 0, 1, 0, 5],
      [3, 0, 1, 0, 4, 0],
      [0, 1, 0, 3, 0, 2],
      [5, 0, 4, 0, 2, 0],
      [0, 2, 0, 5, 0, 1]
    ];
    const pdfBytes = await toPDF(mediumGrid);
    expect(pdfBytes).toBeInstanceOf(Uint8Array);
    expect(pdfBytes.length).toBeGreaterThan(0);
  });

  it('should generate solution PDF when showSolution is true', async () => {
    const puzzle = [
      [5, 3, 0, 0, 7, 0, 0, 0, 0],
      [6, 0, 0, 1, 9, 5, 0, 0, 0],
      [0, 9, 8, 0, 0, 0, 0, 6, 0],
      [8, 0, 0, 0, 6, 0, 0, 0, 3],
      [4, 0, 0, 8, 0, 3, 0, 0, 1],
      [7, 0, 0, 0, 2, 0, 0, 0, 6],
      [0, 6, 0, 0, 0, 0, 2, 8, 0],
      [0, 0, 0, 4, 1, 9, 0, 0, 5],
      [0, 0, 0, 0, 8, 0, 0, 7, 9]
    ];
    
    const solution = [
      [5, 3, 4, 6, 7, 8, 9, 1, 2],
      [6, 7, 2, 1, 9, 5, 3, 4, 8],
      [1, 9, 8, 3, 4, 2, 5, 6, 7],
      [8, 5, 9, 7, 6, 1, 4, 2, 3],
      [4, 2, 6, 8, 5, 3, 7, 9, 1],
      [7, 1, 3, 9, 2, 4, 8, 5, 6],
      [9, 6, 1, 5, 3, 7, 2, 8, 4],
      [2, 8, 7, 4, 1, 9, 6, 3, 5],
      [3, 4, 5, 2, 8, 6, 1, 7, 9]
    ];

    const pdfBytes = await toPDF(puzzle, { 
      showSolution: true,
      title: 'Sudoku Solution'
    }, solution);
    expect(pdfBytes).toBeInstanceOf(Uint8Array);
    expect(pdfBytes.length).toBeGreaterThan(0);
  });

  it('should work without solution parameter when showSolution is false', async () => {
    const pdfBytes = await toPDF(testGrid, { showSolution: false });
    expect(pdfBytes).toBeInstanceOf(Uint8Array);
    expect(pdfBytes.length).toBeGreaterThan(0);
  });
});
