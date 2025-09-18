import MonitorCard from "@/components/MonitorCard";
import WeatherCard from "@/components/WeatherCard";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { AuthProvider } from "@/utils/authContext";
import axios from "axios";
import { CloudRain, Sun } from "lucide-react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useLocationPermission } from "@/hooks/useLocationPermission";

const TEN_MINUTES_MS = 10 * 60 * 1000;

const DEFAULT_TEMPERATURE = 27;
const DEFAULT_DESCRIPTION = "Partly cloudy";
const DEFAULT_HUMIDITY = "50%";

const HomeScreen = () => {
  const colorScheme = useColorScheme() ?? "dark";
  const colors = Colors[colorScheme] || Colors.light;
  const backendURL = "https://ai-crop-health.onrender.com";

  const [weatherData, setWeatherData] = useState({
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
  const [lastFetched, setLastFetched] = useState<number | null>(null);

  const prevLat = useRef<number | null>(null);
  const prevLon = useRef<number | null>(null);

  const { location, errorMsg } = useLocationPermission();

  const getWeatherData = useCallback(
    async (lat: number, long: number) => {
      try {
        const response = await axios.post(
          `${backendURL}/api/weather/forecast`,
          { lat, long }
        );
        if (response.data?.success && response.data.body) {
          setWeatherData({
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
          setLastFetched(Date.now());
        }
      } catch (e) {
        console.error("Weather API error:", e);
      }
    },
    [backendURL]
  );

  useEffect(() => {
    if (
      location &&
      (prevLat.current === null ||
        prevLon.current === null ||
        location.coords.latitude !== prevLat.current ||
        location.coords.longitude !== prevLon.current)
    ) {
      prevLat.current = location.coords.latitude;
      prevLon.current = location.coords.longitude;
      getWeatherData(location.coords.latitude, location.coords.longitude);
    }
  }, [location, getWeatherData]);

  useEffect(() => {
    if (!location) return;
    const interval = setInterval(() => {
      getWeatherData(location.coords.latitude, location.coords.longitude);
    }, TEN_MINUTES_MS);
    return () => clearInterval(interval);
  }, [location, getWeatherData]);

  const avgTemperatureTomorrow =
    typeof weatherData.tomorrow.temperature_max === "number" &&
    typeof weatherData.tomorrow.temperature_min === "number"
      ? (weatherData.tomorrow.temperature_max +
          weatherData.tomorrow.temperature_min) /
        2
      : null;

  const formatHumidity = (val: number | null | undefined) =>
    typeof val === "number" ? `${Math.floor(val)}%` : DEFAULT_HUMIDITY;

  const isCurrentLoaded =
    weatherData.current.temperature_2m !== null &&
    weatherData.current.weather_description !== "" &&
    weatherData.current.relative_humidity_2m !== null;

  const isTomorrowLoaded =
    weatherData.tomorrow.temperature_max !== null &&
    weatherData.tomorrow.temperature_min !== null &&
    weatherData.tomorrow.weather_description !== "";

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
          <WeatherCard
            colors={["#e0f2fe", "#bae6fd"]}
            Icon={Sun}
            day="Today"
            temperature={
              isCurrentLoaded
                ? `${weatherData.current.temperature_2m}°C`
                : `${DEFAULT_TEMPERATURE}°C`
            }
            weather={{
              description: isCurrentLoaded
                ? weatherData.current.weather_description
                : DEFAULT_DESCRIPTION,
              relativeHumidity: isCurrentLoaded
                ? formatHumidity(weatherData.current.relative_humidity_2m)
                : DEFAULT_HUMIDITY,
            }}
          />
        </View>

        {/* Weather Card: Tomorrow */}
        <View style={styles.weatherContainer}>
          <WeatherCard
            colors={["#f3f4f6", "#f3f4f6"]}
            Icon={CloudRain}
            day="Tomorrow"
            temperature={
              isTomorrowLoaded && avgTemperatureTomorrow !== null
                ? `${avgTemperatureTomorrow}°C`
                : `${DEFAULT_TEMPERATURE}°C`
            }
            weather={{
              description: isTomorrowLoaded
                ? weatherData.tomorrow.weather_description
                : DEFAULT_DESCRIPTION,
              relativeHumidity: isTomorrowLoaded
                ? formatHumidity(weatherData.tomorrow.relativeHumidity)
                : DEFAULT_HUMIDITY,
            }}
          />
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
