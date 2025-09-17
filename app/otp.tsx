import React, { useState, useRef, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  TextInput,
  Platform,
  TouchableOpacity,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import CustomButton from "@/components/CustomButton";
import { useRouter, useLocalSearchParams } from "expo-router";
import { MoveRight } from "lucide-react-native";
import axios from "axios";
import { AuthContext } from "@/utils/authContext";
import { saveCookie } from "@/utils/secureCookie";

const OTP_LENGTH = 6;
const COOLDOWN_TIME = 300; // 5 minutes in seconds
const backendURL =
  process.env.EXPO_BACKEND_URL || "https://ai-crop-health.onrender.com";

const OTPScreen: React.FC = () => {
  const authState = useContext(AuthContext);
  const { phoneNumber, auth_type } = useLocalSearchParams<{
    phoneNumber: string;
    auth_type: string;
  }>();
  const colorScheme = useColorScheme() ?? "dark";
  const colors = Colors[colorScheme];
  const router = useRouter();

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setInterval(() => {
        setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [cooldown]);

  const handleOtpChange = (value: string, index: number) => {
    let filtered = value.replace(/[^0-9]/g, "");
    let otpChars = filtered.split("");
    let newOtp = [...otp];

    if (otpChars.length > 1) {
      for (let i = 0; i < otpChars.length && index + i < OTP_LENGTH; ++i) {
        newOtp[index + i] = otpChars[i];
      }
      setOtp(newOtp);
      inputRefs.current[
        Math.min(OTP_LENGTH - 1, index + otpChars.length)
      ]?.focus();
    } else {
      newOtp[index] = filtered;
      setOtp(newOtp);
      if (filtered && index < OTP_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const verifyOTP = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== OTP_LENGTH) {
      setErrorMessage("Please enter complete OTP");
      return;
    }
    try {
      const response = await axios.post(
        `${backendURL}/api/user/${auth_type}/verify`,
        { phoneNumber, otp: otpCode },
        { withCredentials: true }
      );

      if (response.data.success) {
        const token =
          response.data.token || response.headers["set-cookie"]?.[0];

        if (token) {
          await saveCookie(token);
        }

        authState.logIn();
        router.replace("/(protected)/(tabs)");
      } else {
        setErrorMessage(response.data.message || "OTP verification failed");
      }
    } catch (err: any) {
      setErrorMessage(
        err?.response?.data?.message ||
          err?.message ||
          "Could not process request"
      );
    }
  };

  const resendOTP = async () => {
    if (cooldown > 0) return;

    try {
      await axios.post(`${backendURL}/api/user/send-otp`, { phoneNumber });
      setOtp(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
      setErrorMessage("A new OTP has been sent to your phone number.");
      setCooldown(COOLDOWN_TIME);
    } catch (err: any) {
      setErrorMessage(
        err?.response?.data?.message || err?.message || "Unable to resend OTP"
      );
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <SafeAreaProvider style={{ backgroundColor: colors.background }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <SafeAreaView
          style={[styles.container, { backgroundColor: colors.background }]}
        >
          <View style={styles.centerContent}>
            <View style={{ alignItems: "center", marginBottom: 16 }}>
              <Text style={[styles.heading, { color: colors.text }]}>
                Verify OTP
              </Text>
              <Text
                style={[
                  styles.subtitle,
                  { color: colors.textSecondary ?? colors.text },
                ]}
              >
                Enter the 6-digit code sent to your phone.
              </Text>
            </View>
            <View style={styles.otpOuter}>
              <View style={styles.otpContainer}>
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => {
                      inputRefs.current[index] = ref;
                    }}
                    style={[
                      styles.otpInput,
                      {
                        backgroundColor: colors.border,
                        color: colors.text,
                        borderColor: digit ? colors.primary : colors.border,
                      },
                    ]}
                    value={digit}
                    onChangeText={(value) => handleOtpChange(value, index)}
                    onKeyPress={({ nativeEvent }) =>
                      handleKeyPress(nativeEvent.key, index)
                    }
                    keyboardType="number-pad"
                    inputMode="numeric"
                    maxLength={1}
                    textAlign="center"
                    selectTextOnFocus
                    autoFocus={index === 0}
                    accessibilityLabel={`OTP digit ${index + 1}`}
                    importantForAutofill="no"
                    autoComplete="off"
                  />
                ))}
              </View>
            </View>
            {errorMessage && (
              <Text style={styles.subtleError}>{errorMessage}</Text>
            )}
            <CustomButton
              iconProps={{ color: colors.text }}
              style={{
                backgroundColor: colors.primary,
                justifyContent: "center",
                marginTop: 32,
                minWidth: 140,
              }}
              Icon={MoveRight}
              onPress={verifyOTP}
              text="Verify OTP"
            />

            <TouchableOpacity
              onPress={resendOTP}
              disabled={cooldown > 0}
              style={{ marginTop: 24 }}
            >
              <Text
                style={[
                  styles.resendText,
                  {
                    color: cooldown > 0 ? colors.textSecondary : colors.primary,
                    opacity: cooldown > 0 ? 0.6 : 1,
                  },
                ]}
              >
                {cooldown > 0
                  ? `Resend available in ${formatTime(cooldown)}`
                  : "Didn't receive code? Resend OTP"}
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </SafeAreaProvider>
  );
};

export default OTPScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  heading: {
    fontSize: 24,
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
    marginTop: 6,
  },
  otpOuter: {
    alignItems: "center",
    marginBottom: 6,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingHorizontal: 20,
    gap: 12,
  },
  otpInput: {
    width: 45,
    height: 55,
    borderRadius: 12,
    fontSize: 24,
    fontWeight: "600",
    borderWidth: 2,
    textAlign: "center",
    backgroundColor: "transparent",
  },
  subtleError: {
    color: "#ff8888",
    fontSize: 13,
    fontWeight: "400",
    marginVertical: 14,
    textAlign: "center",
  },
  resendText: {
    fontSize: 15,
    textAlign: "center",
    fontWeight: "500",
    textDecorationLine: "underline",
  },
});
