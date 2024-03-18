import React, { ReactNode } from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const {height , width : DimWidth} = Dimensions.get("window");

interface ButtonProps {
  children: ReactNode;
  backgroundColor?: string;
  width?: number;
  onPress: () => void;
}

const Button: React.FC<ButtonProps> = ({
  children,
  backgroundColor = "#cccccc",
  width = DimWidth * 0.21,
  onPress,
}) => {
  return (
    <TouchableOpacity activeOpacity={0.6} onPress={onPress}>
      <View style={[styles.container, { backgroundColor, width }]}>
        <Text style={styles.text}>{children}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "gold",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 40,
    fontWeight: "300",
  },
});
export default Button;
