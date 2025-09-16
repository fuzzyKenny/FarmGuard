import MonitorCard from "@/components/MonitorCard";
import ToolCard from "@/components/ToolCard";
import WeatherCard from "@/components/WeatherCard";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { AuthContext } from "@/utils/authContext";
import { Redirect } from "expo-router";
import { Bug, Calculator, CloudRain, Sun } from "lucide-react-native";
import React, { useContext } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
const HomeScreen = () => {
  const colorScheme = useColorScheme() ?? "dark";
  const colors = Colors[colorScheme] || Colors.light;
  const authState = useContext(AuthContext);

  // console.log(authState.isLoggedIn);
  if (!authState.isLoggedIn) {
    console.log(authState.isLoggedIn);
    // return <Redirect href="/signup" />;
  }

  return (
    <>
      <ScrollView
        style={[
          styles.container,
          { paddingTop: 60, backgroundColor: colors.background },
        ]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 48,
          flexGrow: 1,
        }}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            Weather Forcast
          </Text>
        </View>

        {/* Weather Cards */}

        <View style={styles.weatherContainer}>
          <WeatherCard
            colors={["#e0f2fe", "#bae6fd"]}
            Icon={Sun}
            day="Today"
            note="Perfect for watering!"
            temperature={24}
            weather="Sunny, 65% humidity"
          />
          <WeatherCard
            colors={["#f3f4f6", "#f3f4f6"]}
            Icon={CloudRain}
            day="Tomorrow"
            note="Skip Watering Today"
            temperature={19}
            weather="Light rain. 80% humidity"
          />
        </View>

        {/* Monitor Section */}
        <View style={[styles.monitorSection, { backgroundColor: colors.card }]}>
          <MonitorCard />
        </View>
        <View style={styles.toolsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Plant Care Tools
          </Text>
        </View>

        {/* ToolsSection  */}
        <View style={styles.toolsSection}>
          <View style={styles.toolsGrid}>
            <ToolCard
              text="Crop Health"
              description="Monitor your crop health."
              Icon={Calculator}
              iconColor={colors.primary}
              iconSize={32}
            />
            <ToolCard
              text="Pests & Diseases"
              description="Identify and treat issues"
              Icon={Bug}
              iconColor={colors.error}
              iconSize={32}
              showBadge
              count={3}
              badgeText="Active"
            />
          </View>
        </View>
        <View style={styles.toolsSection}>
          <View style={styles.toolsGrid}>
            <ToolCard
              text="Pests & Diseases"
              description="Identify and treat issues"
              Icon={Bug}
              iconColor={colors.error}
              iconSize={32}
              showBadge
              count={3}
              badgeText="Active"
            />
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
  },
  weatherContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 32,
  },
  weatherCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    minHeight: 140,
  },
  weatherHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  weatherDay: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1f2937",
  },
  temperature: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 4,
  },
  weatherDesc: {
    fontSize: 14,
    color: "#4b5563",
    marginBottom: 4,
  },
  weatherNote: {
    fontSize: 14,
    fontWeight: "500",
    color: "#0369a1",
  },
  monitorSection: {
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    marginBottom: 32,
  },
  monitorContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  plantImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  monitorText: {
    flex: 1,
  },
  monitorTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  monitorSubtitle: {
    fontSize: 14,
  },
  takePictureButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#10b981",
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  takePictureText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "500",
  },
  toolsContainer: {
    gap: 10,
  },
  toolsSection: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
  },
  toolsGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
});
