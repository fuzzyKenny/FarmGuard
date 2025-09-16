import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import CustomInput from "@/components/CustomInput";
import CustomButton from "@/components/CustomButton";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useRouter } from "expo-router";
import { MoveRight } from "lucide-react-native";
import axios from "axios";

const schema = z.object({
  name: z.string().min(3, "Username must be at least 3 characters."),
  phoneNumber: z
    .string()
    .regex(/^[0-9]{10}$/, "Enter a valid 10-digit phone number"),
});
type AuthSchema = z.infer<typeof schema>;
const backendURL = process.env.EXPO_PUBLIC_BACKEND_URL;

const SignUp = () => {
  const colorScheme = useColorScheme() ?? "dark";
  const colors = Colors[colorScheme];
  const router = useRouter();

  const [backendError, setBackendError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AuthSchema>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (backendError) {
      const timer = setTimeout(() => setBackendError(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [backendError]);

  const signUp = async (data: AuthSchema) => {
    setBackendError(null);
    try {
      // Uncomment for backend integration...
      // const response = await axios.post(`${backendURL}/api/user/signup`, data);
      // if (response.data.success) {
      //   router.push({
      //     pathname: "/otp",
      //     params: { phoneNumber: data.phoneNumber, name: data.name },
      //   });
      //   Keyboard.dismiss();
      //   reset();
      // } else {
      //   setBackendError(response.data.message || "Sign up failed. Try again.");
      // }
      Keyboard.dismiss();
      router.push("/otp");
      reset();
    } catch (err: any) {
      setBackendError(
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
          <View style={styles.centerWrapper}>
            <Text style={[styles.heading, { color: colors.primary }]}>
              Sign Up
            </Text>

            <View style={styles.formGroup}>
              {/* Username field and error */}
              <View
                style={[
                  styles.inputContainer,
                  { backgroundColor: colors.border },
                ]}
              >
                <CustomInput
                  control={control}
                  name="name"
                  placeholder="Username"
                  placeholderTextColor={colors.text}
                  keyboardType="default"
                />
                {errors.name?.message && (
                  <Text style={styles.subtleError}>{errors.name.message}</Text>
                )}
              </View>
              {/* Phone field and error */}
              <View
                style={[
                  styles.inputContainer,
                  { backgroundColor: colors.border },
                ]}
              >
                <CustomInput
                  control={control}
                  name="phoneNumber"
                  placeholder="Phone Number"
                  placeholderTextColor={colors.text}
                  keyboardType="number-pad"
                  maxLength={10}
                />
                {errors.phoneNumber?.message && (
                  <Text style={styles.subtleError}>
                    {errors.phoneNumber.message}
                  </Text>
                )}
                {/* General backend error, field agnostic */}
                {backendError && !(errors.name || errors.phoneNumber) && (
                  <Text style={styles.subtleError}>{backendError}</Text>
                )}
              </View>
            </View>

            {/* Improved SignIn Link */}
            <View style={styles.signInRow}>
              <Text style={[styles.switchText, { color: colors.text }]}>
                Already have an account?
              </Text>
              <Link
                href="/signin"
                style={[styles.switchText, styles.signInLink]}
              >
                <Text style={{textDecorationStyle: "dashed"}}>Sign In</Text>
              </Link>
            </View>

            <CustomButton
              Icon={MoveRight}
              iconProps={{ color: "#fff" }}
              onPress={handleSubmit(signUp)}
              text={"Verify"}
              style={{
                backgroundColor: colors.primary,
                justifyContent: "center",
                borderRadius: 32,
                marginTop: 10,
                minWidth: 140,
              }}
            />
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </SafeAreaProvider>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 22,
  },
  centerWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  heading: {
    fontSize: 30,
    fontWeight: "700",
    letterSpacing: 0.6,
    textAlign: "center",
    marginBottom: 20,
  },
  formGroup: {
    width: "100%",
    gap: 6,
    marginBottom: 3,
  },
  inputContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 35,
    width: "100%",
    marginBottom: 2,
  },
  subtleError: {
    color: "#ff8888",
    fontSize: 13,
    fontWeight: "400",
    marginTop: 2,
    marginLeft: 3,
    textAlign: "left",
  },
  switchText: {
    fontSize: 15,
    textAlign: "center",
    fontWeight: "500",
    letterSpacing: 0.15,
  },
  signInRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 16,
  },
  signInLink: {
    color: Colors.light.primary,
    fontWeight: "bold",
    textDecorationLine: "underline",
    marginLeft: 5,
  },
});
