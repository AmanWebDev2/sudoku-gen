import { generateSudoku } from './index';

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
