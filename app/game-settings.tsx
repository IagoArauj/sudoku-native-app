import ControlGroup from "@/components/control-group";
import ThemedButton from "@/components/themed-button";
import { ThemedView } from "@/components/themed-view";
import { useSudoku } from "@/providers/game-provider";
import { Difficulty, SudokuSize } from "@/utils/game";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";

export default function GameSettingsScreen() {
  const sudoku = useSudoku();
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [size, setSize] = useState<SudokuSize>(9);

  useEffect(() => {
    if (sudoku.board !== null) {
      router.navigate("/game");
    }
  }, [sudoku.board]);

  return (
    <ThemedView style={styles.container}>
      <ControlGroup
        title="Tamanho do tabuleiro"
        options={[
          { label: "9x9", value: "9" },
          { label: "4x4", value: "4" },
        ]}
        onChange={(value) => setSize(parseInt(value) as SudokuSize)}
        value={size.toString()}
      />
      <ControlGroup
        title="Dificuldade"
        options={
          size === 9
            ? [
                { label: "Fácil", value: "easy" },
                { label: "Médio", value: "medium" },
                { label: "Difícil", value: "hard" },
              ]
            : [{ label: "Fácil", value: "easy" }]
        }
        onChange={(value) => setDifficulty(value as Difficulty)}
        value={difficulty}
      />

      <ThemedButton
        title="Começar Jogo"
        onPress={async () => {
          await sudoku.createNewGame(size, difficulty);
        }}
        style={{ width: "100%", marginTop: "auto", marginBottom: 40 }}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    gap: 16,
  },
});
