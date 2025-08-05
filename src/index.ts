import { jsPDF } from "jspdf";

type SudokuSize = 4 | 6 | 9;
type Difficulty = "easy" | "medium" | "hard";

type Theme =
  | "light"
  | "dark"
  | {
      background: string;
      gridColor: string;
      textColor: string;
      boxLineColor: string;
    };

interface PDFOptions {
  theme?: Theme;
  title?: string;
  author?: string;
  subject?: string;
  keywords?: string;
}

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

function getThemeColors(theme: Theme) {
  if (theme === "light" || !theme) {
    return {
      background: "#ffffff",
      gridColor: "#000000",
      textColor: "#000000",
      boxLineColor: "#000000",
    };
  } else if (theme === "dark") {
    return {
      background: "#2d2d2d",
      gridColor: "#ffffff",
      textColor: "#ffffff",
      boxLineColor: "#ffffff",
    };
  } else {
    return theme;
  }
}

async function toPDF(
  grid: number[][],
  options: PDFOptions = {}
): Promise<Uint8Array> {
  const {
    theme = "light",
    title = "Sudoku Puzzle",
    author = "Sudoku Generator",
    subject = "Sudoku Puzzle",
    keywords = "sudoku, puzzle, game",
  } = options;

  const colors = getThemeColors(theme);
  const size = grid.length as SudokuSize;

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  doc.setProperties({
    title,
    author,
    subject,
    keywords,
  });

  if (colors.background !== "#ffffff") {
    doc.setFillColor(colors.background);
    doc.rect(0, 0, 210, 297, "F");
  }

  doc.setTextColor(colors.textColor);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.text(title, 105, 30, { align: "center" });

  const cellSize = size === 9 ? 20 : size === 6 ? 25 : 30;
  const totalGridSize = size * cellSize;
  const startX = (210 - totalGridSize) / 2;
  const startY = 60;

  doc.setDrawColor(colors.gridColor);

  for (let i = 0; i <= size; i++) {
    const isBoxLine = getBoxLinePositions(size).includes(i);
    const lineWidth = isBoxLine ? 2.268 : 0.85;
    doc.setLineWidth(lineWidth);

    const x = startX + i * cellSize;
    doc.line(x, startY, x, startY + totalGridSize);

    const y = startY + i * cellSize;
    doc.line(startX, y, startX + totalGridSize, y);
  }

  doc.setTextColor(colors.textColor);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(size === 9 ? 14 : size === 6 ? 16 : 20);

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const cellValue = grid[row][col];
      if (cellValue !== 0) {
        const x = startX + col * cellSize + cellSize / 2;
        const y = startY + row * cellSize + cellSize / 2 + (size === 9 ? 3 : size === 6 ? 4 : 5);
        doc.text(cellValue.toString(), x, y, { align: "center" });
      }
    }
  }

  return new Uint8Array(doc.output("arraybuffer"));
}

function getBoxLinePositions(size: SudokuSize): number[] {
  if (size === 4) {
    return [0, 2, 4];
  } else if (size === 6) {
    return [0, 2, 4, 6];
  } else {
    return [0, 3, 6, 9];
  }
}

export {
  generateSudoku,
  toPDF,
  Sudoku,
  SudokuSize,
  Difficulty,
  Theme,
  PDFOptions,
};
