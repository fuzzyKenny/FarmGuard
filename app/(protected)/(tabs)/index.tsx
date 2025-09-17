import MonitorCard from "@/components/MonitorCard";
import WeatherCard from "@/components/WeatherCard";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { AuthProvider } from "@/utils/authContext";
import axios from "axios";
import { CloudRain, Sun } from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import { useLocationPermission } from "@/hooks/useLocationPermission";

const HomeScreen = () => {
  const colorScheme = useColorScheme() ?? "dark";
  const colors = Colors[colorScheme] || Colors.light;
  const backendURL = "https://ai-crop-health.onrender.com";

  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherData, setWeatherData] = useState({
    loaded: false,
    current: {
      temperature_2m: null as number | null,
      weather_description: "",
      relative_humidity_2m: null as number | null,
    },
    tomorrow: {
      temperature_max: null as number | null,
      temperature_min: null as number | null,
      weather_description: "",
      relativeHumidity: null as number | null,
    },
  });

  const { location, errorMsg } = useLocationPermission();

  const getWeatherData = useCallback(
    async (lat: number, long: number) => {
      setWeatherLoading(true);
      try {
        const response = await axios.post(
          `${backendURL}/api/weather/forecast`,
          {
            lat,
            long,
          }
        );

        // DEBUG log
        console.log("Weather API response:", response.data);

        if (response.data?.success && response.data.body) {
          setWeatherData({
            loaded: true,
            current: {
              temperature_2m:
                response.data.body.current?.temperature_2m ?? null,
              weather_description:
                response.data.body.current?.weather_description ?? "",
              relative_humidity_2m:
                response.data.body.current?.relative_humidity_2m ?? null,
            },
            tomorrow: {
              temperature_max:
                response.data.body.tomorrow?.temperature_max ?? null,
              temperature_min:
                response.data.body.tomorrow?.temperature_min ?? null,
              weather_description:
                response.data.body.tomorrow?.weather_description ?? "",
              relativeHumidity:
                response.data.body.tomorrow?.relative_humidity_2m ?? null,
            },
          });
        }
      } catch (e) {
        console.error("Weather API error:", e);
      } finally {
        setWeatherLoading(false);
      }
    },
    [backendURL]
  );

  useEffect(() => {
    if (location) {
      getWeatherData(location.coords.latitude, location.coords.longitude);
    }
  }, [location, getWeatherData]);

  const avgTemperatureTomorrow =
    typeof weatherData.tomorrow.temperature_max === "number" &&
    typeof weatherData.tomorrow.temperature_min === "number"
      ? (weatherData.tomorrow.temperature_max +
          weatherData.tomorrow.temperature_min) /
        2
      : 0;

  const formatHumidity = (val: number | null | undefined) =>
    typeof val === "number" ? `${Math.floor(val)}%` : "";

  return (
    <AuthProvider>
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
            CropRakshak
          </Text>
        </View>
        {/* Monitor Section */}
        <View style={[styles.monitorSection, { backgroundColor: colors.card }]}>
          <MonitorCard />
        </View>
        <View style={styles.toolsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Weather Forecast
          </Text>
        </View>

        {errorMsg && (
          <Text
            style={{ color: "red", textAlign: "center", marginVertical: 12 }}
          >
            {errorMsg}
          </Text>
        )}

        {/* Weather Card: Today */}
        <View style={styles.weatherContainer}>
          {weatherLoading ? (
            <ActivityIndicator
              size="large"
              color="#0369a1"
              style={{ flex: 1, paddingVertical: 32 }}
            />
          ) : (
            <WeatherCard
              colors={["#e0f2fe", "#bae6fd"]}
              Icon={Sun}
              day="Today"
              temperature={`${weatherData.current.temperature_2m ?? 0}°C`}
              weather={{
                description: weatherData.current.weather_description,
                relativeHumidity: formatHumidity(
                  weatherData.current.relative_humidity_2m
                ),
              }}
            />
          )}
        </View>

        {/* Weather Card: Tomorrow */}
        <View style={styles.weatherContainer}>
          {weatherLoading ? (
            <ActivityIndicator
              size="large"
              color="#0369a1"
              style={{ flex: 1, paddingVertical: 32 }}
            />
          ) : (
            <WeatherCard
              colors={["#f3f4f6", "#f3f4f6"]}
              Icon={CloudRain}
              day="Tomorrow"
              temperature={`${avgTemperatureTomorrow ?? 0}°C`}
              weather={{
                description: weatherData.tomorrow.weather_description,
                relativeHumidity: formatHumidity(
                  weatherData.tomorrow.relativeHumidity
                ),
              }}
            />
          )}
        </View>
      </ScrollView>
    </AuthProvider>
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
