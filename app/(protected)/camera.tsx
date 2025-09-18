import { StyleSheet, Text, View, Pressable, Alert } from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import React, { useRef, useState, useEffect } from "react";
import { Camera as Cam, SwitchCamera, Paperclip } from "lucide-react-native";
import * as MediaLibrary from "expo-media-library";
import { useImagePicker } from "@/hooks/useImagePicker";
import { useRouter } from "expo-router";

const Camera = () => {
  const { pickImage } = useImagePicker();
  const [facing, setFacing] = useState<CameraType>("front");
  const [permission, requestPermission] = useCameraPermissions();
  const camera = useRef<CameraView>(null);
  const router = useRouter();

  useEffect(() => {
    if (permission && !permission.granted) requestPermission();
  }, [permission]);

  if (!permission) return <View style={styles.loadingScreen} />;
  if (!permission.granted)
    return (
      <View style={styles.permissionScreen}>
        <Text style={styles.permissionText}>
          Please grant camera permissions to continue.
        </Text>
      </View>
    );

  const toggleCameraFacing = () =>
    setFacing((current) => (current === "front" ? "back" : "front"));

  async function takePhoto() {
    try {
      const photo = await camera.current?.takePictureAsync();
      if (photo?.uri) {
        await MediaLibrary.createAssetAsync(photo.uri);
        router.push({
          pathname: "/(protected)/imageScreen",
          params: { uri: photo.uri },
        });
      } else {
        Alert.alert("Error", "Failed to take photo.");
      }
    } catch (e) {
      Alert.alert("Error", "Could not save photo.");
      console.error("Photo error:", e);
    }
  }

  async function handlePickImage() {
    const uri = await pickImage(); // Returns URI or null
    if (uri) {
      router.push({
        pathname: "/(protected)/imageScreen",
        params: { uri },
      });
    }
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        ref={camera}
        autofocus="on"
      />
      <View style={styles.buttonFlipContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.iconButton,
            pressed && { opacity: 0.6 },
          ]}
          onPress={toggleCameraFacing}
        >
          <SwitchCamera size={28} color="#222" />
        </Pressable>
      </View>
      <View style={styles.buttonShutterContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.shutterButton,
            pressed && { opacity: 0.6 },
          ]}
          onPress={takePhoto}
        >
          <Cam size={40} color="#fff" />
        </Pressable>
      </View>
      <View style={styles.buttonImagePicker}>
        <Pressable
          style={({ pressed }) => [
            styles.iconButton,
            pressed ? { opacity: 0.6 } : null,
          ]}
          onPress={handlePickImage}
        >
          <Paperclip size={28} color="#000" />
        </Pressable>
      </View>
    </View>
  );
};

export default Camera;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#15181c" },
  camera: {
    height: "70%",
    width: "100%",
    borderRadius: 24,
    overflow: "hidden",
    marginTop: 150,
  },
  loadingScreen: { flex: 1, backgroundColor: "#15181c" },
  permissionScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#15181c",
    paddingHorizontal: 32,
  },
  permissionText: {
    color: "#fff",
    fontSize: 17,
    marginBottom: 14,
    textAlign: "center",
  },
  buttonFlipContainer: { position: "absolute", bottom: 50, left: 30 },
  buttonShutterContainer: {
    position: "absolute",
    bottom: 42,
    left: "50%",
    transform: [{ translateX: -36 }],
  },
  buttonImagePicker: { position: "absolute", bottom: 50, right: 30 },
  iconButton: {
    backgroundColor: "#fff",
    borderRadius: 36,
    width: 56,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.14,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 3 },
  },
  shutterButton: {
    backgroundColor: "#2563eb",
    borderRadius: 44,
    width: 72,
    height: 72,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 6,
    borderColor: "#fff",
    elevation: 12,
    shadowColor: "#000",
    shadowOpacity: 0.16,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 6 },
  },
});
