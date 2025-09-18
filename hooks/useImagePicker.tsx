import * as ImagePicker from "expo-image-picker";
import { useState } from "react";

export function useImagePicker() {
  const [image, setImage] = useState<string | null>(null);

  // Now returns the URI or null!
  const pickImage = async (): Promise<string | null> => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled && result.assets?.[0]?.uri) {
      setImage(result.assets[0].uri);
      return result.assets[0].uri;
    }
    return null;
  };

  return { image, setImage, pickImage };
}
