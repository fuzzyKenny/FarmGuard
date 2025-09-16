import React from "react";
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Alert,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import CustomInput from "@/components/CustomInput";
import CustomButton from "@/components/CustomButton";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { MoveRight } from "lucide-react-native";
import axios from "axios";

const schema = z.object({
  name: z.string().min(1, "Username is required."),
  phoneNumber: z
    .string()
    .regex(/^[0-9]{10}$/, "Enter a valid 10-digit phone number"),
});

type AuthSchema = z.infer<typeof schema>;

// const backendURL = process.env.BACKEND_URL
const backendURL = process.env.EXPO_PUBLIC_BACKEND_URL; // replace with your URL

const Auth = () => {
  const colorScheme = useColorScheme() ?? "dark";
  const colors = Colors[colorScheme];
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthSchema>({
    resolver: zodResolver(schema),
  });

  const signUp = async (data: AuthSchema) => {
    try {
      // Send POST request to backend
      const response = await axios.post(`${backendURL}/api/user/signup`, data);
      // Handle backend response (error/success)
      if (response.data.success) {
        // Navigate to OTP and pass phoneNumber & userName as params
        router.push({
          pathname: "/otp",
          params: { phoneNumber: data.phoneNumber, name: data.name },
        });
        Keyboard.dismiss();
      } else {
        Alert.alert("Sign Up Failed", response.data.message || "Unknown error");
      }
    } catch (err: any) {
      Alert.alert(
        "Backend Error",
        err?.response?.data?.message ||
          err?.message ||
          "Could not process request"
      );
    }
  };

  return (
    <SafeAreaProvider style={[{ backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <SafeAreaView
          style={[styles.container, { backgroundColor: colors.background }]}
        >
          <View style={{ alignItems: "center" }}>
            <Text style={[styles.heading, { color: colors.text }]}>
              Sign Up
            </Text>
          </View>
          <View style={{ gap: 30 }}>
            <View
              style={[
                styles.input,
                {
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: colors.border,
                  gap: 10,
                },
              ]}
            >
              <CustomInput
                control={control}
                name="name"
                placeholder="Username"
                placeholderTextColor={colors.text}
                keyboardType="default"
                error={errors.name?.message}
              />
            </View>
            <View
              style={[
                styles.input,
                {
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: colors.border,
                  gap: 10,
                },
              ]}
            >
              <CustomInput
                control={control}
                name="phoneNumber"
                placeholder="Phone Number"
                placeholderTextColor={colors.text}
                keyboardType="number-pad"
                maxLength={10}
                error={errors.phoneNumber?.message}
              />
            </View>
          </View>

          <CustomButton
            Icon={MoveRight}
            iconProps={{ color: colors.text }}
            onPress={handleSubmit(signUp)}
            text={"Verify"}
            style={{
              backgroundColor: colors.primary,
              justifyContent: "center",
            }}
          />
        </SafeAreaView>
      </KeyboardAvoidingView>
    </SafeAreaProvider>
  );
};

export default Auth;

// ...styles unchanged

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    gap: 30,
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "600",
  },
  input: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 40,
    fontSize: 14,
  },
});
