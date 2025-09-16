import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useFrameworkReady } from "@/hooks/useFrameworkReady";
import { AuthProvider } from "@/utils/authContext";

export default function RootLayout() {
  useFrameworkReady();
  const colorScheme = useColorScheme();
  return (
    <>
      <AuthProvider>
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
        <Stack screenOptions={{ headerShown: false }} />
      </AuthProvider>
    </>
  );
}
