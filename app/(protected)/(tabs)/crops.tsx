import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import axios from "axios";
import { Sprout } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

function CropTile({ crop }: { crop: { name: string; health: string } }) {
  const colorScheme = useColorScheme() ?? "dark";
  const colors = Colors[colorScheme];
  return (
    <>
      <View style={[styles.cropCard, { backgroundColor: colors.card }]}>
        <View style={styles.cropHeader}>
          <Sprout size={24} color="#10b981" />
          <View style={styles.cropInfo}>
            <Text style={[styles.cropName, { color: colors.text }]}>
              {crop.name}
            </Text>
            <Text style={styles.cropStatus}>{crop.health}</Text>
          </View>
        </View>
      </View>
    </>
  );
}

export default function CropsScreen() {
  const backendURL = "https://ai-crop-health.onrender.com";

  const [cropData, setCropData] = useState([]);
  const colorScheme = useColorScheme() ?? "dark";
  const colors = Colors[colorScheme];

  async function getCropData() {
    const response = await axios.get(`${backendURL}/api/crops/`);
    if (response.data.success) {
      setCropData(response.data.body);
    } else {
      console.error(response);
    }
  }

  useEffect(() => {
    getCropData();
  }, []);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Your Crops</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Manage and monitor your plants
        </Text>
      </View>

      {cropData.length > 0 ? (
        cropData.map((crop, index) => <CropTile crop={crop} key={index} />)
      ) : (
        <Text>No Crops Added</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
  },
  cropCard: {
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  cropHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  cropInfo: {
    marginLeft: 12,
    flex: 1,
  },
  cropName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 2,
  },
  cropStatus: {
    fontSize: 14,
    color: "#10b981",
  },
  cropStats: {
    gap: 8,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statText: {
    fontSize: 14,
  },
});
