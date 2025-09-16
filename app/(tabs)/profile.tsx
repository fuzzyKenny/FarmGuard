import Avatar from "@/components/Avatar";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  CircleHelp as HelpCircle,
  LogOut,
  Settings,
} from "lucide-react-native";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import CustomButton from "@/components/CustomButton";

export default function ProfileScreen() {
  const colorScheme = useColorScheme() ?? "dark";
  const colors = Colors[colorScheme];
  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Avatar />
        <Text style={[styles.name, { color: colors.text }]}>
          Yajush Srivastava
        </Text>
        <Text style={[styles.email, { color: colors.textSecondary }]}>
          yajush@randikahana.com
        </Text>
      </View>

      <View style={[styles.section]}>
        <CustomButton
          Icon={Settings}
          text="Settings"
          iconProps={{ size: 20, color: colors.text }}
        />

        <CustomButton
          Icon={LogOut}
          text="Logout"
          iconProps={{ size: 20, color: "#e74444" }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 32,
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
  },
  section: {
    paddingHorizontal: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    gap: 12,
  },
  menuText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
