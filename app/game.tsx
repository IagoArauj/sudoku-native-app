import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useSudoku } from "@/providers/game-provider";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import * as Haptics from "expo-haptics";
import ConfettiCannon from "react-native-confetti-cannon";
import ThemedModal from "@/components/ui/themed-modal";
import ThemedButton from "@/components/themed-button";

const hapticFeedback = () => {
  if (process.env.EXPO_OS === "ios") {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } else if (process.env.EXPO_OS === "android") {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }
};

export default function GameScreen() {
  const sudoku = useSudoku();
  const colorScheme = useColorScheme();

  const [selectedCell, setSelectedCell] = useState<{
    row: number;
    col: number;
    validNumbers: number[];
  } | null>(null);

  // ref para um timeout para esperar o hook do sudoku carregar
  const timeoutRef = useRef<number | null>(null);

  const difficultyMapping = {
    easy: "Fácil",
    medium: "Médio",
    hard: "Difícil",
  };

  useEffect(() => {
    if (!timeoutRef.current)
      timeoutRef.current = setTimeout(() => {
        if (!sudoku.board) {
          router.navigate("/game-settings");
        }
      }, 2000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [sudoku.board]);

  useEffect(() => {
    if (selectedCell?.col && selectedCell?.row) {
      console.log(
        `Selected cell: ${selectedCell.col}x${selectedCell.row}, valid numbers: `,
        selectedCell.validNumbers,
      );
    }
  }, [selectedCell, sudoku]);

  return sudoku.board ? (
    <ThemedView style={{ flex: 1, gap: 10 }}>
      <View style={styles.container}>
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <ThemedText style={{ flex: 1 }} type="subtle">
            {difficultyMapping[sudoku.difficulty]}
          </ThemedText>
          <ThemedText style={{ flex: 1, textAlign: "center" }} type="subtle">
            {sudoku.size}x{sudoku.size}
          </ThemedText>
          <ThemedText style={{ flex: 1, textAlign: "right" }} type="subtle">
            00:00:00
          </ThemedText>
        </View>

        {/* Game Board */}
        <View style={styles.gameBoard}>
          {/* Game Board Content */}
          {sudoku.board.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              {row.map((cell, cellIndex) => {
                const boxSize = Math.sqrt(sudoku.size); // 3 para jogos 9x9, 2 para jogos 4x4

                const isSameRow = selectedCell?.row === rowIndex;
                const isSameCol = selectedCell?.col === cellIndex;

                const isSameBox =
                  selectedCell &&
                  Math.floor(rowIndex / boxSize) ===
                    Math.floor(selectedCell.row / boxSize) &&
                  Math.floor(cellIndex / boxSize) ===
                    Math.floor(selectedCell.col / boxSize);

                const isAdjacent = isSameRow || isSameCol;

                const isSelected = isSameRow && isSameCol;

                return (
                  <Pressable
                    key={cellIndex}
                    onPressOut={hapticFeedback}
                    onPress={() =>
                      setSelectedCell({
                        row: rowIndex,
                        col: cellIndex,
                        validNumbers: sudoku.validNumbers(rowIndex, cellIndex),
                      })
                    }
                    style={({ pressed }) => [
                      {
                        backgroundColor:
                          Colors[colorScheme ?? "dark"].background,
                      },
                      styles.cell,
                      isSelected
                        ? styles.selectedCell
                        : isAdjacent
                          ? selectedCellAdjacentStyle[colorScheme ?? "dark"]
                          : isSameBox
                            ? selectedCellBoxStyle[colorScheme ?? "dark"]
                            : null,
                      pressed && styles.buttonPressed,
                    ]}
                  >
                    <ThemedText
                      style={[
                        styles.cellText,
                        isAdjacent &&
                          selectedCellAdjacentTextStyle[colorScheme ?? "dark"],
                        sudoku!.lockedPositions![rowIndex][cellIndex] && {
                          fontWeight: "700",
                          opacity: 0.7,
                        },
                      ]}
                    >
                      {cell !== 0 ? cell : ""}
                    </ThemedText>
                  </Pressable>
                );
              })}
            </View>
          ))}
        </View>
      </View>

      {/* Game Controls */}
      <View style={[gameControls.base, gameControls[colorScheme ?? "dark"]]}>
        <ThemedView
          style={{
            flexDirection: "column",
            gap: 5,
            padding: 5,
            borderRadius: 15,
          }}
        >
          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.buttonTip,
              pressed && styles.buttonPressed,
            ]}
            onPressIn={hapticFeedback}
            onPress={() => {
              sudoku.generateTip();
            }}
          >
            <Text style={styles.buttonTextBlack}>Dica</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.buttonClearCell,
              pressed && styles.buttonPressed,
              !selectedCell ||
              selectedCell.row === undefined ||
              selectedCell.col === undefined ||
              sudoku.lockedPositions?.[selectedCell.row][selectedCell.col]
                ? styles.buttonDisabled
                : null,
            ]}
            disabled={
              !selectedCell ||
              selectedCell.row === undefined ||
              selectedCell.col === undefined ||
              sudoku.lockedPositions![selectedCell.row][selectedCell.col]
            }
            onPressIn={hapticFeedback}
            onPress={() => {
              if (!selectedCell) return;
              if (
                selectedCell.row === undefined ||
                selectedCell.col === undefined
              )
                return;
              sudoku.removeNumber(selectedCell.row, selectedCell.col);
              setSelectedCell(null);
            }}
          >
            <Text style={styles.buttonTextWhite}>Apagar</Text>
          </Pressable>
          <Pressable
            onPressIn={hapticFeedback}
            onPress={() => {
              setSelectedCell(null);
            }}
            disabled={
              !selectedCell ||
              selectedCell.row === undefined ||
              selectedCell.col === undefined
            }
            style={({ pressed }) => [
              styles.button,
              styles.buttonUnselectCell,
              pressed && styles.buttonPressed,
              !selectedCell ||
              selectedCell.row === undefined ||
              selectedCell.col === undefined
                ? styles.buttonDisabled
                : null,
            ]}
          >
            <Text style={styles.buttonTextWhite}>Desselecionar</Text>
          </Pressable>
        </ThemedView>

        {/* Number selections */}
        <ThemedView
          style={{
            flex: 1,
            aspectRatio: 1,
            borderRadius: 15,
          }}
        >
          {Array.from({ length: 3 }, (_, i) => (
            <View
              key={i}
              style={{ width: "100%", flex: 1, flexDirection: "row" }}
            >
              {Array.from({ length: 3 }, (_, j) => {
                const isSelected =
                  selectedCell &&
                  sudoku.board &&
                  sudoku.board[selectedCell.row][selectedCell.col] ===
                    i * 3 + j + 1;
                const isDisabled =
                  !selectedCell ||
                  !selectedCell.validNumbers.find(
                    (val) => val === i * 3 + j + 1,
                  );
                const isLocked =
                  selectedCell &&
                  sudoku?.lockedPositions?.[selectedCell.row][selectedCell.col];
                return (
                  <Pressable
                    key={j}
                    onPress={() => {
                      if (
                        !selectedCell ||
                        selectedCell.row === undefined ||
                        selectedCell.col === undefined
                      ) {
                        console.error("Invalid cell selection");
                        return;
                      }

                      if (
                        sudoku?.lockedPositions?.[selectedCell.row][
                          selectedCell.col
                        ]
                      ) {
                        console.error("Cell is locked");
                        return;
                      }

                      sudoku.addNumber(
                        selectedCell.row,
                        selectedCell.col,
                        i * 3 + j + 1,
                      );
                    }}
                    disabled={isDisabled || isLocked}
                    onPressIn={hapticFeedback}
                    style={({ pressed }) => [
                      styles.button,

                      isDisabled || isLocked
                        ? styles.buttonDisabled
                        : isSelected && styles.buttonSelected,
                      pressed && styles.buttonPressed,
                      ,
                    ]}
                  >
                    <ThemedText
                      type="defaultSemiBold"
                      style={
                        (isSelected &&
                          !isLocked &&
                          !isDisabled &&
                          styles.buttonTextWhite,
                        { fontSize: 24 })
                      }
                    >
                      {i * 3 + j + 1}
                    </ThemedText>
                  </Pressable>
                );
              })}
            </View>
          ))}
        </ThemedView>
      </View>

      {!sudoku.emptyCells && (
        <>
          <ThemedModal
            title="🏆 Você Venceu!"
            visible={true}
            contentStyle={{
              gap: 16,
            }}
          >
            <ThemedText>Tempo: 05:20</ThemedText>
            <ThemedButton
              style={{ width: "100%" }}
              title="Voltar ao menu"
              onPress={() => {
                sudoku.clearGame();
                router.navigate("/");
              }}
            />
          </ThemedModal>
          <ConfettiCannon
            count={200}
            origin={{ x: -10, y: 0 }}
            fadeOut={true}
          />
        </>
      )}
    </ThemedView>
  ) : (
    <ThemedView>
      <ThemedText>Carregando...</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    gap: 10,
    marginVertical: "auto",
  },
  gameBoard: {
    width: "100%",
    aspectRatio: "1",
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#ccc",
    backgroundColor: "#ccc",
    gap: 1,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    gap: 1,
  },
  cell: {
    flex: 1,
    aspectRatio: "1",
    justifyContent: "center",
    alignItems: "center",
  },
  cellText: {
    fontSize: 24,
    textAlign: "center",
  },
  selectedCell: {
    backgroundColor: Colors.dark.tint,
  },
  selectedCellAdjacent: {
    backgroundColor: "#ddfedd",
  },
  selectedCellAdjacentText: {
    color: "#000",
  },
  button: {
    flex: 1,
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }], // Efeito de "afundar" levemente
  },
  buttonTip: {
    backgroundColor: "#ffcc00",
  },
  buttonClearCell: {
    backgroundColor: "#dc3545",
  },
  buttonUnselectCell: {
    backgroundColor: "#6c757d",
  },
  buttonSelected: {
    backgroundColor: "#007bff",
  },
  buttonTextBlack: {
    color: "#000",
  },
  buttonTextWhite: {
    color: "#fff",
  },
});

const selectedCellAdjacentStyle = StyleSheet.create({
  light: {
    backgroundColor: "#ddfedd",
  },
  dark: {
    backgroundColor: "#687768",
  },
});

const selectedCellBoxStyle = StyleSheet.create({
  light: {
    backgroundColor: "#ddfedd",
  },
  dark: {
    backgroundColor: "#454e45",
  },
});

const selectedCellAdjacentTextStyle = StyleSheet.create({
  light: {
    color: "#000",
  },
  dark: {
    color: "#fff",
  },
});

const gameControls = StyleSheet.create({
  base: {
    width: "100%",
    padding: 20,
    borderTopEndRadius: 30,
    borderTopLeftRadius: 30,
    borderWidth: 1,
    borderBottomWidth: 0,
    flexDirection: "row",
    gap: 10,
  },
  light: {
    backgroundColor: "#f5f5f5",
    borderColor: "#ddd",
  },
  dark: {
    backgroundColor: "#333",
  },
});
