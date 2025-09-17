import { Stack } from "expo-router";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useEffect } from "react";
import * as SystemUI from "expo-system-ui";

export default function ProtectedLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    // Set system background color to match your app theme
    SystemUI.setBackgroundColorAsync(
      colorScheme === "dark" ? "#181a20" : "#fff"
    );
  }, [colorScheme]);
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "fade_from_bottom", // or any other smooth animation
          contentStyle: {
            backgroundColor: colorScheme === "dark" ? "#181a20" : "#fff",
          },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
    </>
  );
}
