import ThemedButton from "@/components/themed-button";
import { ThemedText } from "@/components/themed-text";
import { clearStorage } from "@/utils/storage";
import { router } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function ConfirmDeleteStatsScreen() {
  const handleConfirm = async () => {
    await clearStorage();
    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>Limpar Dados de Estatística</ThemedText>
      <ThemedText style={styles.message}>
        Tem certeza que deseja limpar os dados de estatística?
      </ThemedText>
      <View style={styles.buttonContainer}>
        <ThemedButton title="Confirmar" type="danger" onPress={handleConfirm} />
        <ThemedButton
          title="Cancelar"
          type="secondary"
          onPress={handleCancel}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  message: {
    fontSize: 16,
    marginBottom: 32,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 16,
  },
});
