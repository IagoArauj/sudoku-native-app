import { Image, StyleSheet, useColorScheme, View } from "react-native";

import { ThemedView } from "@/components/themed-view";
import ThemedButton from "@/components/themed-button";
import { router } from "expo-router";
import { useSudoku } from "@/providers/game-provider";

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const sudoku = useSudoku();

  return (
    <ThemedView style={styles.container}>
      <View
        style={{
          height: "auto",
          backgroundColor: "#fff",
          width: "80%",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 10,
          shadowColor: colorScheme === "light" ? "#000" : "#fff",
          shadowOffset: {
            width: 2,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
          overflow: "hidden",
          marginBottom: 16,
        }}
      >
        <Image
          source={require("@/assets/images/sudoku.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      {sudoku.board ? (
        <>
          <ThemedButton
            title="Continuar"
            onPress={() => router.push("/game")}
            style={{ width: "100%" }}
          />
          <ThemedButton
            title="Começar Novo Jogo"
            onPress={() => {
              sudoku.clearGame();
              router.push("/game-settings");
            }}
            style={{ width: "100%" }}
            type="danger"
          />
        </>
      ) : (
        <ThemedButton
          title="Começar Novo Jogo"
          onPress={() => router.push("/game-settings")}
          style={{ width: "100%" }}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    alignItems: "center",
    height: "100%",
    justifyContent: "center",
    gap: 16,
  },
  logo: {
    width: "90%",
    height: 100,
  },
});
