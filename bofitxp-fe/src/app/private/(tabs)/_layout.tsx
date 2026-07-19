import CustomTabBar from "@/components/custom-tab-bar";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <>
      <Tabs
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tabs.Screen name="home" />
        <Tabs.Screen name="quests" />
        <Tabs.Screen name="exercise" />
        <Tabs.Screen name="achievements" />
      </Tabs>
    </>
  );
}
