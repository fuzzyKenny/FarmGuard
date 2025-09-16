import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { router } from "expo-router";
import { Camera } from "lucide-react-native";
import React from "react";
import { Alert, Image, Pressable, StyleSheet, Text, View } from "react-native";
import CustomButton from "./CustomButton";

const MonitorCard: React.FC = () => {
  const colorScheme = useColorScheme() ?? "dark";
  const colors = Colors[colorScheme] || Colors.light;

  const handleTakePicture = async () => {
    // Alert.alert("Camera", "Adding Camera functionality soon...");
    router.push("/(protected)/camera");
  };

  return (
    <>
      <View style={styles.monitorContent}>
        <Image
          source={{
            uri: "https://i.pinimg.com/736x/e2/d1/47/e2d147c6d09cd98462a2d887b2a6c39e.jpg",
          }}
          style={styles.plantImage}
        />
        <View style={styles.monitorText}>
          <Text style={[styles.monitorTitle, { color: colors.text }]}>
            Monitor Your Plants
          </Text>
          <Text
            style={[styles.monitorSubtitle, { color: colors.textSecondary }]}
          >
            Snap a photo to check plant health
          </Text>
        </View>
      </View>
      <CustomButton
        Icon={Camera}
        text="Take Picture"
        iconProps={{ size: 20, color: "#ffffff" }}
        style={styles.takePictureButton}
        onPress={handleTakePicture}
      />
    </>
  );
};

export default MonitorCard;

const styles = StyleSheet.create({
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
  // takePictureText: {
  //   color: "#ffffff",
  //   fontSize: 16,
  //   fontWeight: "500",
  // },
});
