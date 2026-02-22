import { ThemedText } from "@/components/themed-text";
import { BottomTabInset, Spacing } from "@/constants/theme";
import { useThemeColor } from "@/hooks/use-theme-color";
import { formatGameTime } from "@/utils/game";
import { getBestTime, getLastTimes } from "@/utils/storage";
import { useFocusEffect, useTheme } from "@react-navigation/core";
import { useState } from "react";
import { Platform, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Stats() {
  const [bestTimes, setBestTimes] = useState<{ [key: string]: number }>();
  const [lastTimes, setLastTimes] = useState<{ [key: string]: number[] }>();
  const [loading, setLoading] = useState<boolean>(true);
  const safeAreaInsets = useSafeAreaInsets();
  const insets = {
    ...safeAreaInsets,
    bottom: safeAreaInsets.bottom + BottomTabInset + Spacing.three,
  };
  const backgroundColor = useThemeColor(
    { light: undefined, dark: undefined },
    "background",
  );

  const contentPlatformStyle = Platform.select({
    android: {
      paddingTop: insets.top,
      paddingLeft: insets.left,
      paddingRight: insets.right,
      paddingBottom: insets.bottom,
    },
    web: {
      paddingTop: Spacing.six,
      paddingBottom: Spacing.four,
    },
  });

  useFocusEffect(() => {
    setLoading(true);
    Promise.all([
      getBestTime("easy"),
      getBestTime("medium"),
      getBestTime("hard"),
      getLastTimes("easy"),
      getLastTimes("medium"),
      getLastTimes("hard"),
    ]).then(([bEasy, bMedium, bHard, lEasy, lMedium, lHard]) => {
      setBestTimes({ easy: bEasy, medium: bMedium, hard: bHard });
      setLastTimes({ easy: lEasy, medium: lMedium, hard: lHard });
      setLoading(false);
    });
  });

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: backgroundColor,
        paddingHorizontal: Spacing.two,
        paddingVertical: 0,
      }}
      contentInset={insets}
      contentContainerStyle={[contentPlatformStyle]}
    >
      {loading ? (
        <ThemedText type="title" style={{ textAlign: "center" }}>
          Carregando...
        </ThemedText>
      ) : (
        <>
          <ThemedText type="title" style={{ marginBottom: 20 }}>
            Estatísticas de tempo
          </ThemedText>
          <View
            style={{
              gap: 20,
              borderRadius: 20,
              padding: 20,
              backgroundColor: "lightgreen",
              marginBottom: 20,
            }}
          >
            <ThemedText
              type="subtitle"
              style={{ textAlign: "center", color: "black" }}
            >
              Fácil
            </ThemedText>

            <View
              style={{
                gap: 10,
                justifyContent: "space-between",
              }}
            >
              <ThemedText style={{ textAlign: "center", color: "black" }}>
                Melhor: {formatGameTime(bestTimes?.easy ?? 0)}
              </ThemedText>
              <ThemedText style={{ textAlign: "center", color: "black" }}>
                Últimos:{" "}
                {lastTimes?.easy
                  ?.map((t: number) => formatGameTime(t))
                  .join(", ") || "N/A"}
              </ThemedText>
            </View>
          </View>

          <View
            style={{
              gap: 20,
              borderRadius: 20,
              padding: 20,
              marginBottom: 20,
              backgroundColor: "lightgray",
            }}
          >
            <ThemedText
              type="subtitle"
              style={{ textAlign: "center", color: "black" }}
            >
              Médio
            </ThemedText>

            <View
              style={{
                gap: 10,
                justifyContent: "space-between",
              }}
            >
              <ThemedText style={{ textAlign: "center", color: "black" }}>
                Melhor: {formatGameTime(bestTimes?.medium ?? 0)}
              </ThemedText>
              <ThemedText style={{ textAlign: "center", color: "black" }}>
                Últimos:{" "}
                {lastTimes?.medium
                  ?.map((t: number) => formatGameTime(t))
                  .join(", ") || "N/A"}
              </ThemedText>
            </View>
          </View>

          <View
            style={{
              gap: 20,
              borderRadius: 20,
              padding: 20,
              marginBottom: 20,
              backgroundColor: "#e4000f",
            }}
          >
            <ThemedText
              type="subtitle"
              style={{ textAlign: "center", color: "white" }}
            >
              Difícil
            </ThemedText>

            <View
              style={{
                gap: 10,
                justifyContent: "space-between",
              }}
            >
              <ThemedText style={{ textAlign: "center", color: "white" }}>
                Melhor: {formatGameTime(bestTimes?.hard ?? 0)}
              </ThemedText>
              <ThemedText style={{ textAlign: "center", color: "white" }}>
                Últimos:{" "}
                {lastTimes?.hard
                  ?.map((t: number) => formatGameTime(t))
                  .join(", ") || "N/A"}
              </ThemedText>
            </View>
          </View>
        </>
      )}
    </ScrollView>
  );
}
