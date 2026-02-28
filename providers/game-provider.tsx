// create a provider to manage game state

import {
  Board,
  Difficulty,
  formatGameTime,
  generateSudoku,
  isValid,
  SudokuSize,
} from "@/utils/game";
import { loadGame, saveGame } from "@/utils/storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AppState, AppStateStatus } from "react-native";

type GameContextType = {
  board: Board | null;
  lockedPositions: boolean[][] | null;
  difficulty: Difficulty;
  solution: Board | null;
  loading: boolean;
  size: SudokuSize;
  emptyCells: { row: number; col: number }[] | null;
  seconds: number;
  formattedTime: string;
  setIsTimerActive: (active: boolean) => void;
  createNewGame: (size: SudokuSize, difficulty: Difficulty) => Promise<void>;
  addNumber: (row: number, col: number, value: number) => boolean;
  removeNumber: (row: number, col: number) => boolean;
  validNumbers: (row: number, col: number) => number[];
  generateTip: () => { row: number; col: number; value: number } | null;
  clearGame: () => void;
};

export const GameContext = createContext<GameContextType | undefined>(
  undefined,
);

export const useSudoku = () => {
  const context = useContext(GameContext);

  if (!context) {
    throw new Error("useSudoku must be used within a GameContextProvider.");
  }

  return context;
};

export const GameContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [board, setBoard] = useState<Board | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [solution, setSolution] = useState<Board | null>(null);
  const [lockedPositions, setLockedPositions] = useState<boolean[][] | null>(
    null,
  );
  const [size, setSize] = useState<SudokuSize>(9);
  const [loading, setLoading] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);

  // Check all empty cells
  const emptyCells = useMemo(() => {
    if (!board || loading) return null;

    const emptyCells = [];
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (board[row][col] === 0) emptyCells.push({ row, col });
      }
    }

    if (emptyCells.length === 0) return null;
    return emptyCells;
  }, [board, loading]);

  // time formated in HH:MM:SS
  const formattedTime = useMemo(() => {
    return formatGameTime(seconds);
  }, [seconds]);

  // save game on unmount and when app go to background
  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      (nextAppState: AppStateStatus) => {
        if (
          (nextAppState === "inactive" || nextAppState === "background") &&
          board &&
          solution &&
          lockedPositions &&
          !loading
        ) {
          saveGame(board, solution, size, difficulty, lockedPositions, seconds);
        }
      },
    );

    return () => {
      subscription.remove();
      if (!board || loading || !solution) return;
      saveGame(board, solution, size, difficulty, lockedPositions, seconds);
    };
  }, [board, solution, size, difficulty, seconds, lockedPositions, loading]);

  // timers
  useEffect(() => {
    let interval: number;
    let autoSaveInterval: number;

    // count only when board is loaded and empty cells exist
    interval = setInterval(() => {
      if (board && !loading && emptyCells && isTimerActive) {
        setSeconds((prev) => prev + 1);
      }
    }, 1000);

    // auto save every 30 seconds
    autoSaveInterval = setInterval(() => {
      if (board && solution)
        saveGame(board, solution, size, difficulty, lockedPositions, seconds);
    }, 30000);

    return () => {
      clearInterval(interval);
      clearInterval(autoSaveInterval);
    };
  }, [
    board,
    solution,
    size,
    difficulty,
    seconds,
    lockedPositions,
    loading,
    isTimerActive,
    emptyCells,
  ]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const game = await loadGame();
      if (!game) {
        setLoading(false);
        return;
      }

      setBoard(game.board);
      setSolution(game.solution);
      setLockedPositions(game.lockedPositions);
      setSize(game.size);
      setDifficulty(game.difficulty);
      setSeconds(game.seconds);
      setLoading(false);
    };

    load();
  }, []);

  const createNewGame = useCallback(
    async (size: SudokuSize, difficulty: Difficulty) => {
      setLoading(true);

      // Usamos um setTimeout de 0 ou um microtask para garantir que o
      // estado de 'loading' seja renderizado antes da lógica pesada começar.
      const game = await new Promise<{
        puzzle: Board;
        solution: Board;
        lockedPositions: boolean[][];
      }>((resolve) => {
        setTimeout(() => {
          const result = generateSudoku(size, difficulty);
          resolve(result);
        }, 50);
      });
      saveGame(
        game.puzzle,
        game.solution,
        size,
        difficulty,
        game.lockedPositions,
        0,
      );
      setBoard(game.puzzle);
      setSolution(game.solution);
      setLockedPositions(game.lockedPositions);
      setLoading(false);
      setSize(size);
      setDifficulty(difficulty);
      setSeconds(0);
      setIsTimerActive(true);
    },
    [],
  );

  /**
   * Add a number to the board
   *
   * @param row - The row index of the cell to add the number to.
   * @param col - The column index of the cell to add the number to.
   * @param num - The number to add to the cell.
   *
   * @returns true if the number was added successfully, false otherwise.
   */
  const addNumber = useCallback(
    (row: number, col: number, num: number): boolean => {
      if (!board || !solution || loading) return false;
      if (num !== 0 && !isValid(board, row, col, num, size)) return false;

      const newBoard = [...board];
      newBoard[row][col] = num;
      setBoard(newBoard);

      saveGame(newBoard, solution, size, difficulty, lockedPositions, seconds);

      return true;
    },
    [
      board,
      loading,
      setBoard,
      solution,
      size,
      difficulty,
      lockedPositions,
      seconds,
    ],
  );

  /**
   * Remove a number from the board
   *
   * @param row - The row index of the cell to remove the number from.
   * @param col - The column index of the cell to remove the number from.
   *
   * @returns true if the number was removed successfully, false otherwise.
   */
  const removeNumber = useCallback(
    (row: number, col: number) => {
      if (!board || !solution || loading) return false;

      const newBoard = [...board];
      newBoard[row][col] = 0;
      setBoard(newBoard);

      saveGame(newBoard, solution, size, difficulty, lockedPositions, seconds);

      return true;
    },
    [
      board,
      loading,
      setBoard,
      solution,
      size,
      difficulty,
      lockedPositions,
      seconds,
    ],
  );

  /**
   * Return which numbers are valid for a given cell
   *
   * @param row - The row index of the cell to check.
   * @param col - The column index of the cell to check.
   *
   * @returns An array of valid numbers for the given cell.
   */
  const validNumbers = useCallback(
    (row: number, col: number): number[] => {
      if (!board || !solution || loading) return [];

      // reusing isValid function
      const validNumbers = [];
      for (let num = 1; num <= size; num++) {
        if (isValid(board, row, col, num, size)) validNumbers.push(num);
      }
      return validNumbers;
    },
    [board, loading, size, solution],
  );

  /**
   * Generate a random tip from the solution board, that is not already filled in
   */
  const generateTip = useCallback(() => {
    console.log("generating tip");
    if (!solution || loading || !board || !emptyCells) return null;

    const { row, col } =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    console.info(
      `Generated tip at row ${row}, col ${col} with value ${solution[row][col]}`,
    );

    addNumber(row, col, solution[row][col]);

    return { row, col, value: solution[row][col] };
  }, [loading, solution, addNumber, board, emptyCells]);

  /**
   * Clear the game board and solution
   */
  const clearGame = useCallback(() => {
    setBoard(null);
    setSolution(null);
    setLockedPositions(null);
  }, []);

  return (
    <GameContext.Provider
      value={{
        board,
        solution,
        loading,
        lockedPositions,
        size,
        difficulty,
        emptyCells,
        formattedTime,
        seconds,
        createNewGame,
        removeNumber,
        validNumbers,
        addNumber,
        generateTip,
        clearGame,
        setIsTimerActive,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
