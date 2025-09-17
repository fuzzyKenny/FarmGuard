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

// Only phoneNumber field for sign-in
const schema = z.object({
  phoneNumber: z
    .string()
    .regex(/^[0-9]{10}$/, "Enter a valid 10-digit phone number"),
});
type SignInSchema = z.infer<typeof schema>;

const SignIn = () => {
  const colorScheme = useColorScheme() ?? "dark";
  const colors = Colors[colorScheme];
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // <-- new

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignInSchema>({
    resolver: zodResolver(schema),
  });

  const firstError = errors.phoneNumber?.message || errorMessage || null;

  useEffect(() => {
    if (firstError) {
      const timer = setTimeout(() => setErrorMessage(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [firstError]);

  useEffect(() => {
    if (!errorMessage) {
      const validationError = errors.phoneNumber?.message || null;
      if (validationError) {
        setErrorMessage(validationError);
      }
    }
  }, [errors.phoneNumber?.message, errorMessage]);

  const signIn = async (data: SignInSchema) => {
    if (loading) return; // <-- prevent double-tap
    setLoading(true);

    setErrorMessage(null);
    try {
      // const response = await axios.post(`${backendURL}/api/user/login`, data);
      if (false /* response?.data?.success */) {
        router.push({
          pathname: "/otp",
          params: { phoneNumber: data.phoneNumber, auth_type: "login" },
        });
        Keyboard.dismiss();
        reset();
      } else {
        setErrorMessage("Login failed. Try again.");
      }
    } catch (err: any) {
      setErrorMessage(
        err?.response?.data?.message ||
          err?.message ||
          "Could not process request"
      );
    } finally {
      setLoading(false); // <-- re-enable button
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
              Sign In
            </Text>
            <View style={styles.formGroup}>
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
              </View>
            </View>
            {firstError && <Text style={styles.subtleError}>{firstError}</Text>}
            <Text
              style={[
                styles.switchText,
                { color: colors.text, marginVertical: 16 },
              ]}
            >
              Don't have an account?{" "}
              <Link
                href="/signup"
                style={{ fontWeight: "bold", color: colors.primary }}
              >
                Sign Up
              </Link>
            </Text>
            <CustomButton
              Icon={MoveRight}
              iconProps={{ color: "#fff" }}
              onPress={handleSubmit(signIn)}
              text={loading ? "Verifying..." : "Verify"} // <-- loading text
              disabled={loading} // <-- disable while loading
              style={{
                backgroundColor: colors.primary,
                justifyContent: "center",
                borderRadius: 32,
                marginTop: 10,
                minWidth: 140,
                opacity: loading ? 0.7 : 1, // <-- subtle visual feedback
              }}
            />
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </SafeAreaProvider>
  );
};

export default SignIn;

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
    marginVertical: 8,
    textAlign: "center",
  },
  switchText: {
    fontSize: 15,
    textAlign: "center",
    fontWeight: "500",
    letterSpacing: 0.15,
  },
});
