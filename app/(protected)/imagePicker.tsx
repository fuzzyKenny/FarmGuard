import * as ImagePicker from "expo-image-picker";

// export default function ImagePickerExample() {
//   const [image, setImage] = useState<string | null>(null);

const pickImage = async () => {
  // No permissions request is necessary for launching the image library
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images", "videos"],
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });

  // console.log(result);

  if (!result.canceled) {
    // console.log(result.assets[0].uri);
    return result.assets[0].uri;
  }
  return null;
};

export default pickImage;
