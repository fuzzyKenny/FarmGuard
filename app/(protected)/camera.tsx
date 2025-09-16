import { StyleSheet, Text, View, Pressable, Alert } from "react-native";
import {
  CameraView,
  CameraType,
  useCameraPermissions,
  FlashMode,
} from "expo-camera";
import React, { useRef, useState, useEffect } from "react";
import { Camera as Cam, SwitchCamera, Zap } from "lucide-react-native";
import * as MediaLibrary from "expo-media-library";

const Camera = () => {
  const [facing, setFacing] = useState<CameraType>("front");
  const [permission, requestPermission] = useCameraPermissions();
  const [flash, setFlash] = useState<FlashMode>("off");
  // const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions(
  //   { granularPermissions: ["photo", "video"] }
  // );

  const camera = useRef<CameraView>(null);

  useEffect(() => {
    if (permission && !permission.granted) {
      requestPermission();
    }
  }, [permission]);

  // if (!permission || !mediaPermission) {
  //   return <View style={styles.loadingScreen} />;
  // }
  if (!permission) {
    return <View style={styles.loadingScreen} />;
  }

  if (!permission.granted) {
    // Don't show a button, just instruct the user to accept the system prompt
    return (
      <View style={styles.permissionScreen}>
        <Text style={styles.permissionText}>
          Please grant camera permissions to continue.
        </Text>
      </View>
    );
  }

  // if (!mediaPermission.granted) {
  //   return (
  //     <View style={styles.permissionScreen}>
  //       <Text style={styles.permissionText}>
  //         We need media library permissions to save photos
  //       </Text>
  //       <Pressable
  //         style={styles.permissionButton}
  //         onPress={requestMediaPermission}
  //       >
  //         <Text style={styles.permissionButtonText}>
  //           Grant Media Library Permission
  //         </Text>
  //       </Pressable>
  //     </View>
  //   );
  // }

  function toggleCameraFacing() {
    setFacing((current) => (current === "front" ? "back" : "front"));
  }

  async function takePhoto() {
    try {
      const photo = await camera.current?.takePictureAsync();
      if (photo?.uri) {
        const asset = await MediaLibrary.createAssetAsync(photo.uri);
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
      {/* <View style={styles.buttonShutterContainer}>
        <Pressable
         style={({pressed}) => [
          styles.shutterButton,
          pressed && { opacity: 0.6},
        ]} 
        onPress={takePhoto}
        >
          <Cam size={40} color="#fff" />
        </Pressable>
      </View> */}
      <View style={styles.buttonShutterContainer}>
  <Pressable
    style={({ pressed }) => [
      styles.shutterButton,
      pressed ? { opacity: 0.6 } : null
    ]}
    onPress={takePhoto}
  >
    <Cam size={40} color="#fff" />
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
    height: "70%",
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
  buttonFlipContainer: {
    position: "absolute",
    bottom: 56,
    left: 30,
  },

  buttonShutterContainer: {
    position: "absolute",
    bottom: 42,
    left: "50%",
    transform: [{ translateX: -36 }],
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
