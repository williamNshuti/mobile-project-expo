import React, { useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
  Platform,
  SafeAreaView,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import FormInput from "@/app-component/FormInput";
import FormButton from "@/app-component/FormButton";
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import Spinner from "react-native-loading-spinner-overlay";
import { showToast } from "@/app-component/Toaster";
import { COLORS } from "@/constants/theme";
import { createQuestion } from "@/util/database";

const AddQuestionScreen = () => {
  const params = useLocalSearchParams();
  const { id } = params;
  const [currentQuizId, setCurrentQuizId] = useState("nAl3lPyjFDxWNpIrQXd4");
  const [currentQuizTitle, setCurrentQuizTitle] = useState("Math");

  const [question, setQuestion] = useState("");
  const [imageUri, setImageUri] = useState("");
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const [loading, setIsLoading] = useState<boolean>(false);

  const [correctAnswer, setCorrectAnswer] = useState("");
  const [optionTwo, setOptionTwo] = useState("");
  const [optionThree, setOptionThree] = useState("");
  const [optionFour, setOptionFour] = useState("");

  const handleQuestionSave = async () => {
    if (
      question == "" ||
      correctAnswer == "" ||
      optionTwo == "" ||
      optionThree == "" ||
      optionFour == ""
    ) {
      return;
    }
    // Upload Image
    let imageUrl: string = "";
    if (imageUri != "") {
      imageUrl = await handleFileUpload();
    }

    // Add question to db
    const success = await createQuestion(
      currentQuizId,
      {
        question: question,
        correct_answer: correctAnswer,
        incorrect_answers: [optionTwo, optionThree, optionFour],
        imageUrl: imageUrl,
      },
      setIsLoading
    );

    if (success) {
      // Reset
      setQuestion("");
      setCorrectAnswer("");
      setOptionTwo("");
      setOptionThree("");
      setOptionFour("");
      setImageUri("");
    }
  };

  const handleFileUpload = async () => {
    try {
      const storage = getStorage();

      const storageRef = ref(storage, `/images/questions/${currentQuizId}`);

      // Fetch the image as a Blob
      const response = await fetch(imageUri);
      const blob = await response.blob();

      const snapshot = await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log("Download URL:", downloadURL);

      return downloadURL;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  };

  const pickImage = async () => {
    try {
      setImageLoading(true);
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [8, 6],
        quality: 1,
      });
      if (!result.canceled) {
        setImageUri(result?.assets[0].uri);
      }
    } catch (error) {
      alert("Error picking an image. Please try again.");
    } finally {
      setImageLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView
          style={{
            flex: 1,
            backgroundColor: COLORS.white,
          }}
        >
          <Spinner visible={loading} />

          <View style={{ padding: 20 }}>
            <Text style={styles.title}>Add Question</Text>

            <Text style={{ textAlign: "center", marginBottom: 20 }}>
              For {currentQuizTitle}
            </Text>

            <FormInput
              labelText="Question"
              placeholderText="Enter question"
              onChangeText={(val) => setQuestion(val)}
              value={question}
            />

            {/* Image upload */}

            {imageUri == "" ? (
              <TouchableOpacity
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 28,
                  backgroundColor: COLORS.primary + "20",
                }}
                onPress={pickImage}
              >
                {imageLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={{ opacity: 0.5, color: COLORS.primary }}>
                    + add image
                  </Text>
                )}
              </TouchableOpacity>
            ) : (
              <Image
                source={{
                  uri: imageUri,
                }}
                resizeMode={"cover"}
                style={{
                  width: "100%",
                  height: 200,
                  borderRadius: 5,
                }}
              />
            )}

            {/* Options */}
            <View style={{ marginTop: 30 }}>
              <FormInput
                labelText="Correct Answer"
                onChangeText={(val) => setCorrectAnswer(val)}
                value={correctAnswer}
                placeholderText="Enter correct Answer"
              />
              <FormInput
                labelText="Option 2"
                onChangeText={(val) => setOptionTwo(val)}
                value={optionTwo}
                placeholderText="Enter Option Two"
              />
              <FormInput
                labelText="Option 3"
                onChangeText={(val) => setOptionThree(val)}
                value={optionThree}
                placeholderText="Enter Option Three"
              />
              <FormInput
                labelText="Option 4"
                onChangeText={(val) => setOptionFour(val)}
                value={optionFour}
                placeholderText="Enter Option Four"
              />
            </View>
            <FormButton
              labelText="Save Question"
              handleOnPress={handleQuestionSave}
              containerStyle={{ width: "100%" }}
            />
            <FormButton
              containerStyle={{ width: "100%" }}
              labelText="Done & Go Home"
              handleOnPress={() => {
                setCurrentQuizId("");
                router.navigate("/project");
              }}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AddQuestionScreen;
const styles = StyleSheet.create({
  title: {
    fontSize: 34,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    // alignItems: "center",
    // padding: 20,
    backgroundColor: "#f0f0f0",
  },
});
