import React from "react";
import { Text, StyleSheet, Pressable, StyleProp } from "react-native";
import { ViewStyle } from "react-native/Libraries/StyleSheet/StyleSheetTypes";
import * as Haptics from "expo-haptics";

type ButtonProps = {
  title: string;
  onPress: () => void;
  type?: "primary" | "secondary" | "danger";
  style?: StyleProp<ViewStyle>;
};

export default function ThemedButton({
  title,
  onPress,
  type = "primary",
  style = {},
}: ButtonProps) {
  return (
    <Pressable
      onPressIn={() => {
        if (process.env.EXPO_OS === "ios") {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } else if (process.env.EXPO_OS === "android") {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
      }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        styles[type],
        pressed && styles.pressed,
        style,
      ]}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 18,
    paddingHorizontal: 28,
    borderRadius: 3000,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    elevation: 3, // Sombra no Android
    shadowColor: "#000", // Sombra no iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  primary: {
    backgroundColor: "#008932",
  },
  secondary: {
    backgroundColor: "#6c757d",
  },
  danger: {
    backgroundColor: "#dc3545",
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }], // Efeito de "afundar" levemente
  },
  text: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
