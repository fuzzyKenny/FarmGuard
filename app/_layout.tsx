import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useFrameworkReady } from "@/hooks/useFrameworkReady";
import { AuthProvider } from "@/utils/authContext";
import * as SystemUI from "expo-system-ui";

export default function RootLayout() {
  useFrameworkReady();
  const colorScheme = useColorScheme();

  useEffect(() => {
    // Set system background color to match your app theme
    SystemUI.setBackgroundColorAsync(colorScheme === "dark" ? "#181a20" : "#fff");
  }, [colorScheme]);

  return (
    <AuthProvider>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "fade_from_bottom", // or any other smooth animation
          contentStyle: { backgroundColor: colorScheme === "dark" ? "#181a20" : "#fff" },
        }}
      />
    </AuthProvider>
  );
}
