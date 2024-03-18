import { FIRESTORE_DB } from "@/ firebaseConfig";
import FormButton from "@/app-component/FormButton";
import FormInput from "@/app-component/FormInput";
import { signIn } from "@/util/auth";
import { useSession } from "@/util/ctx";
import { Link, router } from "expo-router";
import { addDoc, collection } from "firebase/firestore";
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Pressable,
  Text,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Spinner from "react-native-loading-spinner-overlay";

const Login = () => {
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn: saveSession } = useSession();

  const handleLogin = () => {
    if (emailAddress.trim() === "" || password.trim() === "") {
      alert("Email and password cannot be empty");
      return;
    }
    signIn(emailAddress, password, setLoading).then((user) => {
      if (user) {
        const loggedInTime = new Date();
        const sessionData = { ...user, loggedInTime };
        saveSession(JSON.stringify(sessionData));
        setEmailAddress("");
        setPassword("");
        router.replace("/home");
      }
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Text style={styles.title}>LOGIN</Text>
      <Spinner visible={loading} />

      <TextInput
        autoCapitalize="none"
        placeholder="example@email.com"
        value={emailAddress}
        onChangeText={setEmailAddress}
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

      <Pressable style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </Pressable>

      <View style={styles.linkContainer}>
        <Link href="/" asChild>
          <Text style={styles.linkText}>Forgot password?</Text>
        </Link>
        <Link href="/register" asChild>
          <Text style={styles.linkText}>Create Account</Text>
        </Link>
      </View>
    </KeyboardAvoidingView>
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

export default Login;
