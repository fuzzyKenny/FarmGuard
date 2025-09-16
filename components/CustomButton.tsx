import { LucideProps } from "lucide-react-native";
import {
  Pressable,
  Text,
  StyleSheet,
  PressableProps,
  ViewStyle,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

type CustomButtonProps = {
  Icon: React.ComponentType<LucideProps>;
  iconProps?: LucideProps;
  text: string;
  style?: ViewStyle;
} & PressableProps;

export default function CustomButton({
  Icon,
  iconProps,
  text,
  style,
  ...props
}: CustomButtonProps) {
  const colorScheme = useColorScheme() ?? "dark";
  const colors = Colors[colorScheme];
  return (
    <>
      <Pressable
        {...props}
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: colors.card },
          pressed && { opacity: 0.6 },
          style,
        ]}
      >
        <Text style={[styles.buttonText, { color: colors.text }]}>{text}</Text>
        <Icon {...iconProps} />
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  buttonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    gap: 12,
  },
});
