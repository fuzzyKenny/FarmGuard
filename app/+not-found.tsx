import { Colors } from "@/constants/Colors";
import { Link, Stack } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useColorScheme } from "../hooks/useColorScheme";

const NotFoundScreen = () => {
  const colorScheme = useColorScheme() ?? "dark";
  const colors = Colors[colorScheme] || Colors.light;
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.text, { color: colors.text }]}>
          This screen doesn't exist.
        </Text>
        <Link
          href="/(tabs)"
          style={[styles.link, { color: colors.primary }]}
        >
          Go to home screen!
        </Link>
      </View>
    </>
  );
};

export default NotFoundScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: 600,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
