import { ThemedView } from "./themed-view";
import { ThemedText } from "./themed-text";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useColorScheme } from "@/hooks/use-color-scheme.web";
import { Colors } from "@/constants/theme";

import * as Haptics from "expo-haptics";

type ControlGroupProps = {
  title: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
  value: string;
};

type ControlButtonProps = {
  label: string;
  value: string;
  onPress: () => void;
  isFirst: boolean;
  isLast: boolean;
  isActive: boolean;
};

function ControlButton({
  label,
  value,
  onPress,
  isFirst,
  isLast,
  isActive,
}: ControlButtonProps) {
  const colorScheme = useColorScheme();

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
        isFirst && styles.firstButton,
        isLast && styles.lastButton,
        isActive &&
          (colorScheme === "light"
            ? styles.lightButtonActive
            : styles.darkButtonActive),
        pressed && styles.pressedButton,
      ]}
    >
      <Text
        style={[
          isActive ? styles.activeButtonText : null,
          colorScheme === "dark"
            ? styles.darkButtonText
            : styles.lightButtonText,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export default function ControlGroup({
  title,
  options,
  onChange,
  value,
}: ControlGroupProps) {
  const colorScheme = useColorScheme();
  return (
    <ThemedView style={[styles.container]}>
      <ThemedText type="defaultSemiBold">{title}</ThemedText>
      <View
        style={[
          styles.buttonContainer,
          { backgroundColor: colorScheme === "dark" ? "#000" : "#f5f5f5" },
        ]}
      >
        {options.map((option, index) => (
          <ControlButton
            key={option.value}
            label={option.label}
            value={option.value}
            onPress={() => onChange(option.value)}
            isFirst={index === 0}
            isLast={index === options.length - 1}
            isActive={value === option.value}
          />
        ))}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    borderRadius: 9999,
    borderWidth: 1,
    padding: 0,
  },
  button: {
    padding: 10,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  firstButton: {
    borderTopLeftRadius: 9999,
    borderBottomLeftRadius: 9999,
  },
  lastButton: {
    borderTopRightRadius: 9999,
    borderBottomRightRadius: 9999,
  },
  lightButtonActive: {
    backgroundColor: Colors.light.tint,
    borderRadius: 9999,
  },
  darkButtonActive: {
    backgroundColor: Colors.dark.tint,
    borderRadius: 9999,
  },
  activeButtonText: {
    color: "#000",
  },
  darkButtonText: {
    color: Colors.dark.text,
  },
  lightButtonText: {
    color: Colors.light.text,
  },
  pressedButton: {
    opacity: 0.7,
  },
});
