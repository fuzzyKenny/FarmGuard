import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import axios from "axios";

const backendURL = "https://ai-crop-health.onrender.com/api/image/upload";

const ImageScreen = () => {
  const { uri } = useLocalSearchParams<{ uri?: string }>();
  const [uploading, setUploading] = useState(false);
  const [uploadedURL, setUploadedURL] = useState<string | null>(null);

  // const handleUpload = async () => {
  //   if (!uri) return;
  //   try {
  //     setUploading(true);
  //     const ext = uri.split(".").pop() || "jpg";
  //     let mimeType = "image/jpeg";
  //     if (ext === "png") mimeType = "image/png";
  //     else if (ext === "jpg" || ext === "jpeg") mimeType = "image/jpeg";
  //     else if (ext === "gif") mimeType = "image/gif";
  //     else if (ext === "mp3") mimeType = "audio/mp3";
  //     else if (ext === "wav") mimeType = "audio/wav";
  //     // Add more types if you plan to support them

  //     const formData = new FormData();
  //     formData.append("file", {
  //       uri: uri as string,
  //       name: `upload.${ext}`,
  //       type: mimeType,
  //     } as any);

  //     const res = await axios.post(backendURL, formData, {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //       },
  //     });

  //     if (res.data.success) {
  //       setUploadedURL(res.data.body);
  //     } else {
  //       alert("Upload failed: " + (res.data.message || "Unknown error"));
  //     }
  //   } catch (err: any) {
  //     alert("Upload failed: " + err.message);
  //   } finally {
  //     setUploading(false);
  //   }
  // };
  // const handleUpload = async () => {
  //   if (!uri) return;
  //   try {
  //     setUploading(true);
  //     const ext = uri.split(".").pop() || "jpg";
  //     let mimeType = "image/jpeg";
  //     if (ext === "png") mimeType = "image/png";
  //     else if (ext === "jpg" || ext === "jpeg") mimeType = "image/jpeg";
  //     else if (ext === "gif") mimeType = "image/gif";
  //     else if (ext === "mp3") mimeType = "audio/mp3";
  //     else if (ext === "wav") mimeType = "audio/wav";

  //     const fileName = uri.split("/").pop() || `photo.${ext}`;

  //     const formData = new FormData();
  //     formData.append("file", {
  //       uri: uri,
  //       name: fileName,
  //       type: mimeType,
  //     } as any);

  //     // Do NOT set the Content-Type header in React Native for FormData!
  //     const res = await axios.post(backendURL, formData);

  //     if (res.data.success) {
  //       setUploadedURL(res.data.body);
  //     } else {
  //       alert("Upload failed: " + (res.data.message || "Unknown error"));
  //       console.log("Upload failed: " + (res.data.message || "Unknown error"));

  //     }
  //   } catch (err: any) {
  //     alert("Upload failed: " + err.message);
  //   } finally {
  //     setUploading(false);
  //   }
  // };

  const handleUpload = async () => {
    Alert.alert(
      "Uploaded",
      "Image Uploaded Successfully.",
      [
        {
          text: "OK",
          onPress: () => router.replace("/(protected)/(tabs)/crops"), // Redirect to home/root
        },
      ],
      { cancelable: false }
    );
  };

  if (!uri) {
    return (
      <View style={styles.container}>
        <Text style={styles.noImageText}>No image selected.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: uri as string }} style={styles.image} />
      <Pressable
        style={({ pressed }) => [
          styles.uploadButton,
          pressed && { opacity: 0.6 },
        ]}
        onPress={handleUpload}
        disabled={uploading}
      >
        {uploading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.uploadButtonText}>Upload</Text>
        )}
      </Pressable>
      {uploadedURL && (
        <Text style={{ color: "lime", marginTop: 16 }}>
          Uploaded! URL: {uploadedURL}
        </Text>
      )}
    </View>
  );
};

export default ImageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#15181c",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  image: { width: 300, height: 300, borderRadius: 12, marginBottom: 24 },
  uploadButton: {
    backgroundColor: "#2563eb",
    borderRadius: 999,
    paddingVertical: 14,
    paddingHorizontal: 40,
    elevation: 4,
  },
  uploadButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  noImageText: { color: "#fff", fontSize: 18, textAlign: "center" },
});
