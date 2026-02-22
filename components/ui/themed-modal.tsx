import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  ViewStyle,
} from "react-native";
import { ThemedView } from "../themed-view";
import { ThemedText } from "../themed-text";

type ModalProps = {
  visible: boolean;
  title: string;
  children: React.ReactNode;
  containerStyle?: ViewStyle;
  contentStyle?: ViewStyle;
};

export default function ThemedModal({
  visible,
  title,
  children,
  containerStyle,
  contentStyle,
}: ModalProps) {
  return (
    <Modal
      animationType="fade" // ou "slide"
      transparent={true}
      visible={visible}
    >
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
