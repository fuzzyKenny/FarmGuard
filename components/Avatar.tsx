import { User2 } from "lucide-react-native";
import React from "react";
import { Image, StyleSheet, View } from "react-native";

const Avatar = () => {
  return (
    <View style={[styles.avatar]}>
      {/* <Image
        style={[styles.image]}
        source={{
          uri: "https://i.pinimg.com/736x/e2/d1/47/e2d147c6d09cd98462a2d887b2a6c39e.jpg",
        }}
      /> */}
      <User2 size={80} color="#ffffff"/>
    </View>
  );
};

export default Avatar;

const styles = StyleSheet.create({
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  image: {
    height: 100,
    width: 100,
    borderRadius: 50,
  },
});
