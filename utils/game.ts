export type SudokuSize = 4 | 9;
export type Difficulty = "easy" | "medium" | "hard";
export type Board = number[][];

export const isValid = (
  grid: number[][],
  row: number,
  col: number,
  num: number,
  size: SudokuSize,
) => {
  const boxSize = Math.sqrt(size);
  for (let x = 0; x < size; x++) {
    if (grid[row][x] === num || grid[x][col] === num) return false;
  }
  const startRow = row - (row % boxSize);
  const startCol = col - (col % boxSize);
  for (let i = 0; i < boxSize; i++) {
    for (let j = 0; j < boxSize; j++) {
      if (grid[i + startRow][j + startCol] === num) return false;
    }
  }
  return true;
};

export function generateSudoku(
  size: SudokuSize,
  difficulty: Difficulty,
): {
  puzzle: Board;
  solution: Board;
  lockedPositions: boolean[][];
} {
  // 1. Criar matriz vazia
  let board = Array.from({ length: size }, () => Array(size).fill(0));
  let lockedPositions = Array.from({ length: size }, () =>
    Array(size).fill(true),
  );

  // 3. Solver (Backtracking) para preencher o tabuleiro
  const fillBoard = (grid: number[][]) => {
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (grid[row][col] === 0) {
          const nums = Array.from({ length: size }, (_, i) => i + 1).sort(
            () => Math.random() - 0.5,
          );
          for (let num of nums) {
            if (isValid(grid, row, col, num, size)) {
              grid[row][col] = num;
              if (fillBoard(grid)) return true;
              grid[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  };

  fillBoard(board);
  const solution = board.map((row) => [...row]); // Salva a resposta

  // 4. Remover números baseado na dificuldade
  let attempts =
    size === 4
      ? 6
      : difficulty === "easy"
        ? 30
        : difficulty === "medium"
          ? 45
          : 55;

  while (attempts > 0) {
    let row = Math.floor(Math.random() * size);
    let col = Math.floor(Math.random() * size);
    if (board[row][col] !== 0) {
      board[row][col] = 0;
      lockedPositions[row][col] = false;
      attempts--;
    }
  }

  return { puzzle: board, solution, lockedPositions };
}

export const formatGameTime = (seconds: number) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const parts = [
    hrs > 0 ? hrs.toString().padStart(2, "0") : "00",
    mins.toString().padStart(2, "0"),
    secs.toString().padStart(2, "0"),
  ];

  return parts.join(":");
};
