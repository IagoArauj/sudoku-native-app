import { Platform } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { BottomTabInset, Fonts, Spacing } from "@/constants/theme";
import ThemedButton from "@/components/themed-button";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeColor } from "@/hooks/use-theme-color";

export default function TabTwoScreen() {
  const router = useRouter();
  const safeAreaInsets = useSafeAreaInsets();

  const insets = {
    ...safeAreaInsets,
    top: safeAreaInsets.top + Spacing.two + BottomTabInset,
    bottom: BottomTabInset,
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

  return (
    <ThemedView
      style={{
        flex: 1,
        backgroundColor: backgroundColor,
        gap: 20,
        paddingHorizontal: Spacing.two,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      <ThemedText type="title" style={{ fontFamily: Fonts.rounded }}>
        Configurações
      </ThemedText>

      {/* Outros itens de configuração aqui... */}

      <ThemedButton
        title="Limpar Dados de Estatística"
        type="danger"
        onPress={() => {
          router.push("/confirm-delete-stats");
        }}
        // Agora o 'auto' encontrará o limite do flexGrow e jogará o botão para baixo
        style={{ marginTop: "auto", marginBottom: insets.bottom }}
      />
    </ThemedView>
  );
}
