import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  TextInput,
  Alert,
  Platform,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import CustomButton from "@/components/CustomButton";
import { useRouter } from "expo-router";
import { ArrowBigRight, MoveRight } from "lucide-react-native";

const OTP_LENGTH = 6;

const OTPScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? "dark";
  const colors = Colors[colorScheme];

  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const inputRefs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Restrict to numbers and support paste
  const handleOtpChange = (value: string, index: number) => {
    let filtered = value.replace(/[^0-9]/g, "");
    let otpChars = filtered.split("");
    let newOtp = [...otp];

    if (otpChars.length > 1) {
      // handle paste
      for (let i = 0; i < otpChars.length && index + i < OTP_LENGTH; ++i) {
        newOtp[index + i] = otpChars[i];
      }
      setOtp(newOtp);
      // Focus next input or last
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

  // Handle backspace navigation
  const handleKeyPress = (key: string, index: number) => {
    if (key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const verifyOTP = () => {
    const otpCode = otp.join("");
    if (otpCode.length !== OTP_LENGTH) {
      // Alert.alert("Error", "Please enter complete OTP");
      // console.error("Error", "Please enter complete OTP.");
      console.log("Error", "Please enter complete OTP.");

      return;
    }
    // Simulate successful verification
    console.log("Verifying OTP:", otpCode);
    // Alert.alert("Success", "OTP verified successfully!", [
    //   {
    //     text: "OK",
    //     onPress: () => router.replace("/(tabs)"),
    //   },
    // ]);

    router.replace("/(protected)/(tabs)");
  };

  const resendOTP = () => {
    Alert.alert("OTP Sent", "A new OTP has been sent to your phone number");
    setOtp(Array(OTP_LENGTH).fill(""));
    inputRefs.current[0]?.focus();
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
          <View style={{ alignItems: "center", marginBottom: 10 }}>
            <Text style={[styles.heading, { color: colors.text }]}>
              Verify OTP
            </Text>
            <Text
              style={[
                styles.subtitle,
                { color: colors.textSecondary ?? colors.text },
              ]}
            >
              Enter the 6-digit code sent to your phone number
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

            {otp.join("").length !== OTP_LENGTH && (
              <Text style={styles.errorText}>Please enter complete OTP</Text>
            )}
          </View>

          <View style={styles.buttonContainer}>
            <CustomButton
              iconProps={{ color: colors.text }}
              style={{
                backgroundColor: colors.primary,
                justifyContent: "center",
              }}
              Icon={MoveRight}
              onPress={verifyOTP}
              text="Verify OTP"
            />
            <Text
              style={[styles.resendText, { color: colors.primary }]}
              onPress={resendOTP}
            >
              Didn't receive code? Resend OTP
            </Text>
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
    justifyContent: "flex-end",
    padding: 20,
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
    marginBottom: 10,
    gap: 10,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
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
  errorText: {
    color: "#ff3333",
    fontSize: 13,
    marginTop: 2,
    alignSelf: "center",
    textAlign: "center",
  },
  buttonContainer: {
    marginTop: 25,
    gap: 16,
  },
  resendText: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    textDecorationLine: "underline",
    marginTop: 8,
  },
});
