import AsyncStorage from "@react-native-async-storage/async-storage";
import { Board, Difficulty, SudokuSize } from "./game";

// Carrega o jogo salvo
export const loadGame = async (): Promise<{
  board: Board;
  lockedPositions: boolean[][];
  solution: Board;
  size: SudokuSize;
  difficulty: Difficulty;
} | null> => {
  const savedGame = await AsyncStorage.getItem("@saved_game");
  if (!savedGame) return null;
  return JSON.parse(savedGame);
};

// Salva o jogo
export const saveGame = async (
  board: Board,
  solution: Board,
  size: SudokuSize,
  difficulty: Difficulty,
  lockedPositions: boolean[][] | null,
) => {
  await AsyncStorage.setItem(
    "@saved_game",
    JSON.stringify({ board, solution, size, difficulty, lockedPositions }),
  );
};

// Salvar o melhor tempo e os últimos 3 tempos
export const saveTime = async (seconds: number, difficulty: Difficulty) => {
  const best = await getBestTime(difficulty);

  if (seconds < best) {
    await AsyncStorage.setItem(`@best_time_${difficulty}`, seconds.toString());
  }

  const lastTimes = await getLastTimes(difficulty);
  const newLastTimes = [seconds, ...lastTimes].slice(0, 3);
  await AsyncStorage.setItem(
    `@last_times_${difficulty}`,
    JSON.stringify(newLastTimes),
  );
};

// Ler o melhor tempo
export const getBestTime = async (difficulty: Difficulty) => {
  const value = await AsyncStorage.getItem(`@best_time_${difficulty}`);
  return value !== null ? parseInt(value) : 0;
};

// Ler os 3 últimos tempos
export const getLastTimes = async (difficulty: Difficulty) => {
  const lastTimes = await AsyncStorage.getItem(`@last_times_${difficulty}`);
  let parsedTimes;
  if (!lastTimes) {
    parsedTimes = [];
  } else {
    parsedTimes = JSON.parse(lastTimes);
  }
  return parsedTimes.map((time: string) => parseInt(time));
};

// Limpar o melhor tempo
export const clearBestTime = async (difficulty: Difficulty) => {
  try {
    await AsyncStorage.removeItem(`@best_time_${difficulty}`);
  } catch (e) {
    console.error("Erro ao limpar", e);
  }
};

// Limpa todo o storage
export const clearStorage = async () => {
  try {
    await AsyncStorage.clear();
  } catch (e) {
    console.error("Erro ao limpar", e);
  }
};
