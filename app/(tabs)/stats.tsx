import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

export default function Stats() {
  return (
    <ThemedView
      style={{
        padding: 20,
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
      }}
    >
      <ThemedText style={{ textAlign: "center" }}>
        Comece a jogar para ver suas estatísticas!
      </ThemedText>
    </ThemedView>
  );
}
