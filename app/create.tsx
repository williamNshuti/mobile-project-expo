import FormButton from "@/app-component/FormButton";
import FormInput from "@/app-component/FormInput";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, Text } from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import { router } from "expo-router";
import { useSQLiteContext } from "expo-sqlite/next";
import { AddQuiz } from "@/util/sqllite";

function CreateQuiz() {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const db = useSQLiteContext();

  const handleQuizSave = async () => {
    if (title.trim() === "" || description.trim() === "") {
      alert("Please enter both title and description.");
      return;
    }

    const success = await AddQuiz(title, description, setLoading, db);
    if (success) {
      setTitle("");
      setDescription("");
    }
    router.back();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Text style={styles.title}>Create Quiz</Text>
      <Spinner visible={loading} />

      <FormInput
        labelText="Title"
        placeholderText="Enter Quiz Title"
        onChangeText={(val) => setTitle(val)}
        value={title}
      />
      <FormInput
        labelText="Description"
        placeholderText="Enter Description"
        onChangeText={(val) => setDescription(val)}
        value={description}
      />

      <FormButton
        containerStyle={{ width: "100%" }}
        labelText="Create Quiz"
        handleOnPress={handleQuizSave}
      />
    </KeyboardAvoidingView>
  );
}

export default CreateQuiz;

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
