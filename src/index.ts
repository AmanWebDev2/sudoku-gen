type SudokuSize = 4 | 6 | 9;
type Difficulty = "easy" | "medium" | "hard";

interface Sudoku {
  size: SudokuSize;
  grid: number[][];
  solution: number[][];
  difficulty: Difficulty;
}

function generateSudoku(size: SudokuSize, difficulty: Difficulty): Sudoku {
  const grid = createEmptyGrid(size);
  const solution = createEmptyGrid(size);

  fillGrid(grid, size);
  copyGrid(grid, solution);
  removeNumbers(grid, difficulty, size);

  return {
    size,
    grid,
    solution,
    difficulty,
  };
}

function createEmptyGrid(size: SudokuSize): number[][] {
  return Array(size)
    .fill(0)
    .map(() => Array(size).fill(0));
}

function copyGrid(from: number[][], to: number[][]): void {
  for (let i = 0; i < from.length; i++) {
    for (let j = 0; j < from[i].length; j++) {
      to[i][j] = from[i][j];
    }
  }
}

function fillGrid(grid: number[][], size: SudokuSize): boolean {
  const emptyCell = findEmptyCell(grid, size);
  if (!emptyCell) {
    return true;
  }

  const [row, col] = emptyCell;
  const numbers = shuffle(getPossibleNumbers(size));

  for (const num of numbers) {
    if (isValid(grid, row, col, num, size)) {
      grid[row][col] = num;
      if (fillGrid(grid, size)) {
        return true;
      }
      grid[row][col] = 0;
    }
  }

  return false;
}

function findEmptyCell(
  grid: number[][],
  size: SudokuSize
): [number, number] | null {
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (grid[i][j] === 0) {
        return [i, j];
      }
    }
  }
  return null;
}

function getPossibleNumbers(size: SudokuSize): number[] {
  const numbers: number[] = [];
  for (let i = 1; i <= size; i++) {
    numbers.push(i);
  }
  return numbers;
}

function shuffle(array: any[]): any[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function isValid(
  grid: number[][],
  row: number,
  col: number,
  num: number,
  size: SudokuSize
): boolean {
  return (
    !isInRow(grid, row, num, size) &&
    !isInCol(grid, col, num, size) &&
    !isInBox(grid, row, col, num, size)
  );
}

function isInRow(
  grid: number[][],
  row: number,
  num: number,
  size: SudokuSize
): boolean {
  for (let i = 0; i < size; i++) {
    if (grid[row][i] === num) {
      return true;
    }
  }
  return false;
}

function isInCol(
  grid: number[][],
  col: number,
  num: number,
  size: SudokuSize
): boolean {
  for (let i = 0; i < size; i++) {
    if (grid[i][col] === num) {
      return true;
    }
  }
  return false;
}

function isInBox(
  grid: number[][],
  row: number,
  col: number,
  num: number,
  size: SudokuSize
): boolean {
  let boxSizeRow: number;
  let boxSizeCol: number;

  if (size === 4) {
    boxSizeRow = 2;
    boxSizeCol = 2;
  } else if (size === 6) {
    boxSizeRow = 2;
    boxSizeCol = 3;
  } else {
    boxSizeRow = 3;
    boxSizeCol = 3;
  }

  const startRow = row - (row % boxSizeRow);
  const startCol = col - (col % boxSizeCol);

  for (let i = 0; i < boxSizeRow; i++) {
    for (let j = 0; j < boxSizeCol; j++) {
      if (grid[startRow + i][startCol + j] === num) {
        return true;
      }
    }
  }

  return false;
}

function removeNumbers(
  grid: number[][],
  difficulty: Difficulty,
  size: SudokuSize
): void {
  const attempts = getAttempts(difficulty, size);

  for (let i = 0; i < attempts; i++) {
    let row = Math.floor(Math.random() * size);
    let col = Math.floor(Math.random() * size);

    while (grid[row][col] === 0) {
      row = Math.floor(Math.random() * size);
      col = Math.floor(Math.random() * size);
    }

    const backup = grid[row][col];
    grid[row][col] = 0;

    const gridCopy = createEmptyGrid(size);
    copyGrid(grid, gridCopy);

    if (!hasUniqueSolution(gridCopy, size)) {
      grid[row][col] = backup;
    }
  }
}

function getAttempts(difficulty: Difficulty, size: SudokuSize): number {
  const totalCells = size * size;
  let percentage = 0;

  switch (difficulty) {
    case "easy":
      percentage = 0.4;
      break;
    case "medium":
      percentage = 0.55;
      break;
    case "hard":
      percentage = 0.7;
      break;
  }

  return Math.floor(totalCells * percentage);
}

function hasUniqueSolution(grid: number[][], size: SudokuSize): boolean {
  let count = 0;
  solve(grid, size, () => {
    count++;
  });
  return count === 1;
}

function solve(
  grid: number[][],
  size: SudokuSize,
  onSolution: () => void
): void {
  const emptyCell = findEmptyCell(grid, size);
  if (!emptyCell) {
    onSolution();
    return;
  }

  const [row, col] = emptyCell;
  const numbers = getPossibleNumbers(size);

  for (const num of numbers) {
    if (isValid(grid, row, col, num, size)) {
      grid[row][col] = num;
      solve(grid, size, onSolution);
      grid[row][col] = 0;
    }
  }
}

export { generateSudoku, Sudoku, SudokuSize, Difficulty };
