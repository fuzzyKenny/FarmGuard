import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import axios from "axios";
import { Badge, Sprout, Trash2 } from "lucide-react-native";
import React, { useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
  ActivityIndicator,
} from "react-native";

type Crop = {
  _id: string;
  name: string;
  variety: string;
};

function CropTile({
  crop,
  onDelete,
}: {
  crop: { _id: string; name: string; variety: string };
  onDelete: (_id: string) => void;
}) {
  const colorScheme = useColorScheme() ?? "dark";
  const colors = Colors[colorScheme];

  return (
    <View style={[styles.cropCard, { backgroundColor: colors.card }]}>
      <View style={styles.cropHeader}>
        <Sprout size={24} color="#10b981" />
        <View style={styles.cropInfo}>
          <Text style={[styles.cropName, { color: colors.text }]}>
            {crop.name}
          </Text>
          <Text style={styles.cropStatus}>{crop.variety}</Text>
          <View
            style={{
              backgroundColor: colors.error,
              position: "absolute",
              borderRadius: 10,
              bottom: -35,
              left: -5,
            }}
          >
            <Text
              style={[styles.healthStatus, { color: colors.text, padding: 5 }]}
            >
              Unhealthy: Early Blight
            </Text>
          </View>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Delete ${crop.name}`}
          onPress={() => onDelete(crop._id)}
          hitSlop={8}
          style={styles.deleteButton}
        >
          <Trash2 size={20} color="#ef4444" />
        </Pressable>
      </View>
    </View>
  );
}

export default function CropsScreen() {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [cropName, setCropName] = useState("");
  const [cropVariety, setCropVariety] = useState("");
  const [loading, setLoading] = useState(true);
  const colorScheme = useColorScheme() ?? "dark";
  const colors = Colors[colorScheme];
  const backendURL = "https://ai-crop-health.onrender.com";

  async function getCrops() {
    try {
      setLoading(true);
      const response = await axios.get(`${backendURL}/api/crops/`);
      if (response.data.success) {
        setCrops(response.data.body);
        console.log(response.data);
      } else {
        console.error("Failed to load crops", response.data);
      }
    } catch (error) {
      console.error("Error fetching crops:", error);
    } finally {
      setLoading(false);
    }
  }

  // useEffect(() => {
  //   getCrops();
  // }, []);

  useFocusEffect(
    useCallback(() => {
      getCrops();
    }, [])
  );

  async function addCrop() {
    const name = cropName.trim();
    const variety = cropVariety.trim();
    if (!name || !variety) return;

    try {
      const response = await axios.post(`${backendURL}/api/crops/add`, {
        name,
        variety,
      });

      if (response.data.success) {
        setCropName("");
        setCropVariety("");
        setCrops((prev) => [...prev, response.data.body]);
      } else {
        Alert.alert("Error", "Could not add crop");
      }
    } catch (error) {
      console.error("Error adding crop:", error);
    }
  }

  async function deleteCrop(id: string) {
    try {
      const response = await axios.delete(`${backendURL}/api/crops/${id}`);
      if (response.data.success) {
        setCrops((prev) => prev.filter((c) => c._id !== id));
      } else {
        Alert.alert("Error", "Could not delete crop");
      }
    } catch (error) {
      console.error("Error deleting crop:", error);
    }
  }

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <ActivityIndicator size="large" color="#10b981" />
        <Text style={{ marginTop: 12, color: colors.textSecondary }}>
          Loading crops...
        </Text>
      </View>
    );
  }

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

      <View style={styles.formContainer}>
        <TextInput
          value={cropName}
          onChangeText={setCropName}
          placeholder="Crop name (e.g. Tomatoes)"
          placeholderTextColor={colors.textSecondary}
          style={[
            styles.input,
            {
              backgroundColor: colors.card,
              color: colors.text,
              borderColor: colors.border,
            },
          ]}
          returnKeyType="next"
        />
        <TextInput
          value={cropVariety}
          onChangeText={setCropVariety}
          placeholder="Enter Crop Variety"
          placeholderTextColor={colors.textSecondary}
          style={[
            styles.input,
            {
              backgroundColor: colors.card,
              color: colors.text,
              borderColor: colors.border,
            },
          ]}
          onSubmitEditing={addCrop}
          returnKeyType="done"
        />
        <Pressable
          accessibilityRole="button"
          onPress={addCrop}
          style={({ pressed }) => [
            styles.addButton,
            { backgroundColor: pressed ? "#059669" : "#10b981" },
          ]}
        >
          <Text style={styles.addButtonText}>Add Crop</Text>
        </Pressable>
      </View>

      {crops.length === 0 ? (
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          No crops added yet
        </Text>
      ) : (
        crops.map((c) => (
          <CropTile
            key={c._id}
            crop={{ _id: c._id, name: c.name, variety: c.variety }}
            onDelete={deleteCrop}
          />
        ))
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
  formContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  addButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
  },
  addButtonText: {
    color: "#062e27",
    fontSize: 16,
    fontWeight: "700",
  },
  cropCard: {
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 30,
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
  deleteButton: {
    padding: 8,
    borderRadius: 8,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 8,
  },
  healthStatus: {
    fontSize: 14,
  },
});
