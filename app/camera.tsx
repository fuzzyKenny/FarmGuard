import { StyleSheet, Text, View, Pressable, Alert } from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import React, { useRef, useState } from "react";
import { Camera as Cam, SwitchCamera, Zap } from "lucide-react-native";
import * as MediaLibrary from "expo-media-library";

const Camera = () => {
  const [facing, setFacing] = useState<CameraType>("front");
  const [permission, requestPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions(
    { granularPermissions: ["photo", "video"] }
  );

  const camera = useRef<CameraView>(null);

  if (!permission || !mediaPermission) {
    return <View style={styles.loadingScreen} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionScreen}>
        <Text style={styles.permissionText}>We need camera permissions</Text>
        <Pressable style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </Pressable>
      </View>
    );
  }

  if (!mediaPermission.granted) {
    return (
      <View style={styles.permissionScreen}>
        <Text style={styles.permissionText}>We need media library permissions to save photos</Text>
        <Pressable style={styles.permissionButton} onPress={requestMediaPermission}>
          <Text style={styles.permissionButtonText}>Grant Media Library Permission</Text>
        </Pressable>
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "front" ? "back" : "front"));
  }

  async function takePhoto() {
    try {
      const photo = await camera.current?.takePictureAsync();
      if (photo?.uri) {
        const asset = await MediaLibrary.createAssetAsync(photo.uri);
        Alert.alert("Photo Saved.");
        console.log("Saved Asset", asset);
      } else {
        Alert.alert("Error", "Failed to take photo.");
      }
    } catch (e) {
      Alert.alert("Error", "Could not save photo.");
      console.error("Photo error:", e);
    }
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={camera}>
        {/* Simple center focusing overlay for guidance */}
        <View pointerEvents="none" style={styles.focusRingOuter}>
          <View style={styles.focusRingInner} />
        </View>
      </CameraView>
      <View style={styles.buttonContainer}>
        <Pressable style={styles.iconButton} onPress={toggleCameraFacing}>
          <SwitchCamera size={28} color="#222" />
        </Pressable>
        <Pressable style={styles.shutterButton} onPress={takePhoto}>
          <Cam size={40} color="#fff" />
        </Pressable>
        <Pressable style={styles.iconButton} onPress={toggleCameraFacing}>
          <Zap size={28} color="#222" />
        </Pressable>
      </View>
    </View>
  );
};

export default Camera;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#15181c",
    justifyContent: "center",
    alignItems: "center",
  },
  camera: {
    flex: 1,
    alignSelf: "stretch",
    borderRadius: 24,
    overflow: "hidden",
  },
  loadingScreen: {
    flex: 1,
    backgroundColor: "#15181c",
  },
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
  permissionButton: {
    backgroundColor: "#2563eb",
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 32,
    elevation: 5,
    marginTop: 8,
  },
  permissionButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 56,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingHorizontal: 38,
    gap: 24,
  },
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
  focusRingOuter: {
    position: "absolute",
    top: "45%",
    left: "40%",
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.22)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 4,
  },
  focusRingInner: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.38)",
  },
});
