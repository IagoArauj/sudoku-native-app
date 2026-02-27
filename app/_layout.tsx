import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { GameContextProvider } from "@/providers/game-provider";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { Platform } from "react-native";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <GameContextProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="game"
            options={{
              headerShown: true,
              title: "",
              headerBackButtonDisplayMode: "minimal",
              headerShadowVisible: false,
            }}
          />
          <Stack.Screen
            name="game-settings"
            options={{
              headerShown: true,
              title: "Configurações do Jogo",
              headerBackButtonDisplayMode: "minimal",
            }}
          />
          <Stack.Screen
            name="confirm-delete-stats"
            options={{
              headerTransparent: Platform.OS === "ios",
              headerLargeTitleEnabled: false,
              title: "",
              presentation: isLiquidGlassAvailable() ? "formSheet" : "modal",
              headerBackButtonDisplayMode: "minimal",
              sheetGrabberVisible: true,
              sheetAllowedDetents: [0.3],
              sheetInitialDetentIndex: 0,
              contentStyle: {
                backgroundColor: isLiquidGlassAvailable()
                  ? "transparent"
                  : Colors[colorScheme ?? "light"].background,
              },
              headerStyle: {
                backgroundColor: isLiquidGlassAvailable()
                  ? "transparent"
                  : Colors[colorScheme ?? "light"].background,
              },
              headerBlurEffect: isLiquidGlassAvailable()
                ? undefined
                : (colorScheme ?? "light"),
            }}
          />
        </Stack>
        <StatusBar style="auto" />
      </GameContextProvider>
    </ThemeProvider>
  );
}
