# Sudoku Generator

A simple and flexible Sudoku generator that can create puzzles of different sizes and difficulty levels.

## Installation

```bash
npm install @amanwebdev/sudoku-generator
```

## Usage

```javascript
const { generateSudoku } = require('@amanwebdev/sudoku-generator');

// Generate a 9x9 Sudoku with easy difficulty
const sudoku = generateSudoku(9, 'easy');

console.log('Puzzle:');
console.log(sudoku.grid);

console.log('Solution:');
console.log(sudoku.solution);
```

## API

### `generateSudoku(size, difficulty)`

Generates a new Sudoku puzzle.

-   `size`: The size of the Sudoku grid. Can be `4`, `6`, or `9`.
-   `difficulty`: The difficulty of the puzzle. Can be `'easy'`, `'medium'`, or `'hard'`.

Returns a `Sudoku` object with the following properties:

-   `size`: The size of the Sudoku grid.
-   `grid`: A 2D array representing the puzzle.
-   `solution`: A 2D array representing the solution.
