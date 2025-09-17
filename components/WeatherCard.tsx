import React, { useState, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import type { FC } from "react";
import type { SvgProps } from "react-native-svg";
import type { LinearGradientProps } from "expo-linear-gradient";

type WeatherCardProps = {
  day: string;
  temperature: string;
  weather: { description: string; relativeHumidity?: string };
  Icon: FC<SvgProps>;
  isLoading?: boolean;
} & LinearGradientProps;

const WeatherCard: FC<WeatherCardProps> = ({
  day,
  temperature,
  weather,
  Icon,
  isLoading = false,
  ...linearGradientProps
}) => {
  if (isLoading) {
    return (
      <LinearGradient {...linearGradientProps} style={styles.weatherCard}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#1f2937" />
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient {...linearGradientProps} style={styles.weatherCard}>
      <View style={styles.dayContainer}>
        <Text style={styles.weatherDay}>{day}</Text>
        <Icon width={60} height={60} />
      </View>
      <Text style={styles.temperature}>{temperature}</Text>
      <Text style={[styles.weatherDesc, styles.weatherNote]}>{`${
        weather.description
      } ${weather.relativeHumidity ?? ""}`}</Text>
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
