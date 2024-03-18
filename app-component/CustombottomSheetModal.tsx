import {
  View,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { forwardRef, useMemo, useState } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useSQLiteContext } from "expo-sqlite/next";
import { AddQuiz } from "@/util/sqllite";
import Spinner from "react-native-loading-spinner-overlay";
import FormButton from "./FormButton";
import FormButtomInput from "./FormBottomInput";
import { sendNotification } from "./Notification";

export type Ref = BottomSheetModal;

interface CustomBottomSheetModalProps {
  getData: () => Promise<void>;
  dismiss: () => void;
}

const CustomBottomSheetModal = forwardRef<Ref, CustomBottomSheetModalProps>(
  ({ getData, dismiss }, ref) => {
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
        await sendNotification();
        setTitle("");
        setDescription("");
        getData();
        dismiss();
      }
    };
    const snapPoints = useMemo(() => ["55%", "85%"], []);
    return (
      <BottomSheetModal
        //   handleIndicatorStyle={{ backgroundColor: "#fff" }}
        //   backgroundStyle={{ backgroundColor: "#1d0f4e" }}
        ref={ref}
        index={0}
        keyboardBehavior="extend"
        snapPoints={snapPoints}
        enableDismissOnClose={true}
        enablePanDownToClose={true}
        onDismiss={() => {
          setTitle("");
          setDescription("");
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
          <Spinner visible={loading} />
          <View>
            <Text style={styles.title}>Create Quiz</Text>
          </View>

          <View style={{ flex: 2, width: "100%" }}>
            <FormButtomInput
              labelText="Title"
              placeholderText="Enter Quiz Title"
              onChangeText={(val) => setTitle(val)}
              value={title}
            />
            <FormButtomInput
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
          </View>
        </KeyboardAvoidingView>
      </BottomSheetModal>
    );
  }
);

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
  containerHeadline: {
    fontSize: 24,
    fontWeight: "600",
    padding: 20,
  },

  input: {
    marginTop: 8,
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 10,
    fontSize: 16,
    lineHeight: 20,
    padding: 8,
    backgroundColor: "rgba(151, 151, 151, 0.25)",
    color: "#fff",
    width: 200,
  },
  container: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    marginBottom: 60,
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

export default CustomBottomSheetModal;
