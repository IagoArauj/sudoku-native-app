import { NativeTabs, Icon, Label } from "expo-router/unstable-native-tabs";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <NativeTabs tintColor={Colors[colorScheme!].tint}>
      <NativeTabs.Trigger name="index">
        <Label>Início</Label>
        <Icon
          sf={{ default: "house", selected: "house.fill" }}
          drawable="ic_menu_mylocation"
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="stats">
        <Label>Estatísticas</Label>
        <Icon
          sf={{ default: "chart.bar", selected: "chart.bar.fill" }}
          drawable="ic_menu_game"
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="config">
        <Label>Configurações</Label>
        <Icon sf={"gear"} drawable="ic_menu_manage" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );

  /* Old tabs
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Início",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="config"
        options={{
          title: "Configurações",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="gear" color={color} />
          ),
        }}
      />
    </Tabs>
  );
  */
}
