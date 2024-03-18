import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

interface LogoutButtonProps {
  onPress: () => void;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.logoutButton} onPress={onPress}>
      <FontAwesome name="sign-out" size={24} color="white" />
      <Text style={styles.logoutText}>Logout</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4B1913",
    padding: 10,
    borderRadius: 5,
    margin: 10,
  },
  logoutText: {
    color: "white",
    marginLeft: 10,
    fontSize: 16,
  },
});

export default LogoutButton;
