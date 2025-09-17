import { User2 } from "lucide-react-native";
import React from "react";
import { Image, StyleSheet, View } from "react-native";

const Avatar = () => {
  return (
    <View style={[styles.avatar]}>
      <Image
        style={[styles.image]}
        source={{
          uri: "https://cdn.discordapp.com/attachments/1369429967162839063/1417949820131213372/farmer-pfp_1.jpg?ex=68cc582d&is=68cb06ad&hm=751c669209c9fc89c29a97c6a15fd868b315ee55c1fda368a8141686b1a4b3a7&",
        }}
      />
      {/* <User2 size={80} color="#ffffff"/> */}
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
