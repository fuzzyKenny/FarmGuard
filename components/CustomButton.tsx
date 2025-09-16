import { Icon, LogOut, LucideProps } from "lucide-react-native";
import {
  Pressable,
  Text,
  StyleSheet,
  PressableProps,
  ViewStyle,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

type CustomProfileButtonProps = {
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
}: CustomProfileButtonProps) {
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
        <Icon {...iconProps} />
        <Text style={[styles.buttonText, { color: colors.text }]}>{text}</Text>
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
