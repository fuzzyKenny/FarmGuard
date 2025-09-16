import {
  View,
  Text,
  TextInput,
  TextInputProps,
  StyleSheet,
} from "react-native";
import { Controller, Control } from "react-hook-form";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

type CustomInputProps = {
  control: Control<any>;
  name: string;
  error?: string;
} & TextInputProps;

const CustomInput = ({ control, name, error, ...props }: CustomInputProps) => {
  const colorScheme = useColorScheme() ?? "dark";
  const colors = Colors[colorScheme];

  return (
    <>
      <View style={{ width: "100%" }}>
        <Controller
          control={control}
          name={name}
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInput
              {...props}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              style={[
                styles.inputText,
                props.style,
                {
                  color: colors.text,
                },
              ]}
            />
          )}
        />
        {!!error && <Text style={[styles.errorText, {position: "absolute", bottom: -35}]}>{error}</Text>}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  inputText: {
    fontSize: 16,
    fontWeight: "400",
    borderRadius: 40,
    paddingVertical: 10,
    paddingHorizontal: 18,
    width: "100%",
  },
  errorText: {
    marginTop: 4,
    color: "#ff4444",
    fontSize: 13,
    alignSelf: "center",
    textAlign: "center",
  },
});

export default CustomInput;
