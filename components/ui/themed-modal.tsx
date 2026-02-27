import React from "react";
import {
  Modal,
  ModalProps,
  StyleSheet,
  View,
  ViewStyle
} from "react-native";
import { ThemedText } from "../themed-text";
import { ThemedView } from "../themed-view";

type ThemedModalProps = {
  visible: boolean;
  title: string;
  children: React.ReactNode;
  containerStyle?: ViewStyle;
  contentStyle?: ViewStyle;
} & ModalProps;

export default function ThemedModal({
  visible,
  title,
  children,
  containerStyle,
  contentStyle,
  animationType = "fade",
  ...props
}: ThemedModalProps) {
  return (
    <Modal animationType={animationType} visible={visible} {...props}>
      <View style={[styles.overlay, containerStyle]}>
        <ThemedView style={[styles.modalContent, contentStyle]}>
          <ThemedText style={styles.title}>{title}</ThemedText>
          {children}
        </ThemedView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)", // Fundo escurecido
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: 300,
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    elevation: 5,
  },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
});
