import { createAccount } from "@/util/auth";
import { Link } from "expo-router";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Pressable,
  Text,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import Spinner from "react-native-loading-spinner-overlay";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = () => {
    if (email.trim() === "" || password.trim() === "") {
      alert("Email and password cannot be empty");
      return;
    }
    createAccount(email, password, setLoading).then(() => {
      setEmail("");
      setPassword("");
    });
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>REGISTER</Text>
      <Spinner visible={loading} />
      <TextInput
        autoCapitalize="none"
        placeholder="example@email.com"
        value={email}
        onChangeText={setEmail}
        style={styles.inputField}
        placeholderTextColor="#999"
      />
      <TextInput
        placeholder="password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.inputField}
        placeholderTextColor="#999"
      />
      <Pressable style={styles.loginButton} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </Pressable>

      <View style={styles.linkContainer}>
        <Link href="/" asChild>
          <Text style={styles.linkText}>Forgot password?</Text>
        </Link>
        <Link href="/login" asChild>
          <Text style={styles.linkText}>Login</Text>
        </Link>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f0f0f0",
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    marginBottom: 20,
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
  loginButton: {
    marginTop: 20,
    backgroundColor: "#6c47ff",
    width: "100%",
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
  linkContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 20,
  },
  linkText: {
    marginTop: 10,
    color: "#6c47ff",
    fontSize: 16,
  },
});

export default Register;
