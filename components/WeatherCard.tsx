import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";
import type { FC } from "react";
import type { SvgProps } from "react-native-svg";
import { LinearGradientProps } from "expo-linear-gradient";

// The Icon prop should be a function component (e.g., Sun, Cloudy, CloudRain)
type WeatherCardProps = {
  day: string;
  temperature: number;
  weather: { description: string; relativeHumidity: number };
  note: string;
  Icon: FC<SvgProps>;
} & LinearGradientProps;

const WeatherCard: FC<WeatherCardProps> = ({
  day,
  temperature,
  weather,
  note,
  Icon,
  ...linearGradientProps
}) => {
  return (
    <LinearGradient {...linearGradientProps} style={styles.weatherCard}>
      <View style={styles.dayContainer}>
        <Text style={styles.weatherDay}>{day}</Text>
        <Icon width={60} height={60} />
      </View>
      <Text style={styles.temperature}>{temperature}°C</Text>
      <Text
        style={styles.weatherDesc}
      >{`${weather.description}, ${weather.relativeHumidity} %`}</Text>
      <Text style={styles.weatherNote}>{note}</Text>
    </LinearGradient>
  );
};

export default WeatherCard;

const styles = StyleSheet.create({
  weatherCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    minHeight: 140,
  },
  dayContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  weatherDay: {
    fontSize: 36,
    fontWeight: "400",
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
    fontSize: 13,
    fontWeight: "500",
    color: "#0369a1",
  },
});
