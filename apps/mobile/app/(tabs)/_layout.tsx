import { Tabs } from "expo-router";
import { View } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#1C1C1E",
          borderTopColor: "#2C2C2E",
        },
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "#8E8E93",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          // Icon setup will come later with shared icons
        }}
      />
      <Tabs.Screen
        name="habits"
        options={{
          title: "Habits",
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: "Analytics",
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
        }}
      />
    </Tabs>
  );
}
