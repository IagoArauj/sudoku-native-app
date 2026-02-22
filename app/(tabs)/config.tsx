import { Image } from "expo-image";
import { Platform, StyleSheet } from "react-native";

import { Collapsible } from "@/components/ui/collapsible";
import { ExternalLink } from "@/components/external-link";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Fonts } from "@/constants/theme";
import { setStatusBarStyle } from "expo-status-bar";
import { useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import ThemedButton from "@/components/themed-button";
import { useRouter } from "expo-router";

export default function TabTwoScreen() {
  const router = useRouter();

  const greenBg = { light: "#34C759", dark: "#008932" };
  const purpleBg = { light: "#800080", dark: "#5c0a5c" };

  // Select between green and purple randomically
  const selectedColor = Math.random() < 0.5 ? greenBg : purpleBg;

  useFocusEffect(
    useCallback(() => {
      setStatusBarStyle("light", true);

      return () => setStatusBarStyle("auto", true);
    }, []),
  );

  return (
    <ParallaxScrollView
      headerBackgroundColor={selectedColor}
      headerImage={
        <IconSymbol
          size={310}
          color="white"
          name="heart"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
          }}
        >
          Configurações
        </ThemedText>
      </ThemedView>

      <ThemedButton
        title="Limpar Dados de Estatística"
        type="danger"
        onPress={() => {
          router.push("/confirm-delete-stats");
        }}
        style={{ marginTop: 18 }}
      />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
