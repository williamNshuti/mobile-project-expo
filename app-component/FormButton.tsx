import React, { FC } from "react";
import {
  Text,
  Pressable,
  PressableProps,
  TextStyle,
  ViewStyle,
  StyleSheet,
} from "react-native";

interface FormButtonProps extends PressableProps {
  labelText?: string;
  handleOnPress?: () => void;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
}

const FormButton: FC<FormButtonProps> = ({
  labelText = "",
  handleOnPress,
  containerStyle,
  labelStyle,
  ...rest
}) => {
  return (
    <Pressable
      style={[styles.loginButton, containerStyle]}
      onPress={handleOnPress}
      {...rest}
    >
      <Text style={styles.buttonText}>{labelText}</Text>
    </Pressable>
  );
};

export default FormButton;

const styles = StyleSheet.create({
  loginButton: {
    marginTop: 20,
    backgroundColor: "#6c47ff",
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
