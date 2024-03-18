import React, { FC } from "react";
import {
  View,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  ViewStyle,
  StyleSheet,
} from "react-native";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";

interface FormButtomProps extends TextInputProps {
  labelText?: string;
  placeholderText?: string;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  inputStyle?: TextStyle;
}

const FormButtomInput: FC<FormButtomProps> = ({
  labelText = "",
  placeholderText = "",
  onChangeText,
  value,
  containerStyle,
  labelStyle,
  inputStyle,
  ...rest
}) => {
  return (
    <View style={[{ width: "100%", marginBottom: 10 }, containerStyle]}>
      <Text style={[styles.title, labelStyle]}>{labelText}</Text>
      <BottomSheetTextInput
        style={styles.inputField}
        autoCapitalize="words"
        placeholder={placeholderText}
        onChangeText={onChangeText}
        placeholderTextColor="#999"
        value={value}
        {...rest}
      />
    </View>
  );
};

export default FormButtomInput;

const styles = StyleSheet.create({
  title: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 1,
    color: "#333",
  },
  inputField: {
    marginVertical: 10,
    height: 50,
    width: "100%",
    borderWidth: 1,
    borderColor: "#6c47ff",
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },
});
