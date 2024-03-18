import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { IconButton } from "react-native-paper";
import { useSQLiteContext } from "expo-sqlite/next";
import { router, useLocalSearchParams } from "expo-router";
import { AddQuestions, DeleteQuestion, UpdateQuestion } from "@/util/sqllite";
import Spinner from "react-native-loading-spinner-overlay";
import { AutoSizeText, ResizeTextMode } from "react-native-auto-size-text";
import { COLORS } from "@/constants/theme";

type QuestionType = {
  id: number;
  title: string;
  quiz_id: number;
};

const QuestionScreen = () => {
  // Init local states
  const [question, setQuestion] = useState<any>("");
  const [editedquestion, setEditedQuestion] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const params = useLocalSearchParams();
  const { id, title } = params;

  const [questions, setquestions] = React.useState<QuestionType[]>([]);
  const db = useSQLiteContext();

  React.useEffect(() => {
    db.withTransactionAsync(async () => {
      await getData();
    });
  }, [db]);

  async function getData() {
    const result: QuestionType[] = await db.getAllAsync<QuestionType>(
      `SELECT * FROM Questions WHERE quiz_id = ?;`,
      [parseInt(id as string)]
    );
    setquestions(result);
  }

  // Handle Add question
  const handleAddquestion = async () => {
    if (question.trim() === "") {
      alert("Please Enter The Question.");
      return;
    }

    const success = await AddQuestions(
      parseInt(id as string),
      question,
      setLoading,
      db
    );
    if (success) {
      await getData();
      setQuestion("");
    }
  };

  // Handle Edit question

  const handleEditquestion = (question: any) => {
    setEditedQuestion(question);
    setQuestion(question.title);
  };

  // Handle Update

  const handleUpdatequestion = () => {
    UpdateQuestion(parseInt(editedquestion.id), question, db).then(async () => {
      await getData();
      setEditedQuestion(null);
      setQuestion("");
    });
  };

  // Render question
  const renderquestions = ({ item, index }: { item: any; index: any }) => {
    return (
      <View
        style={{
          backgroundColor: "#336699",
          borderRadius: 6,
          paddingHorizontal: 6,
          paddingVertical: 8,
          marginBottom: 12,
          flexDirection: "row",
          alignItems: "center",
          shadowColor: "#336699",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.8,
          shadowRadius: 3,
        }}
      >
        <AutoSizeText
          fontSize={15}
          numberOfLines={2}
          style={{
            color: "#fff",
            fontSize: 15,
            fontWeight: "800",
            flex: 1,
            padding: 10,
            paddingVertical: 15,
          }}
          mode={ResizeTextMode.max_lines}
        >
          {item.title}
        </AutoSizeText>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <IconButton
            icon="pencil"
            iconColor="#fff"
            onPress={() => handleEditquestion(item)}
            size={20}
            style={{
              padding: 0,
              margin: 0,
            }}
          />
          <IconButton
            icon="trash-can"
            iconColor="#fff"
            onPress={() => {
              DeleteQuestion(parseInt(item.id), db).then(
                async () => await getData()
              );
            }}
            size={20}
            style={{
              padding: 0,
              margin: 0,
            }}
          />
          <IconButton
            icon="eye"
            iconColor="#fff"
            size={20}
            style={{
              padding: 0,
              margin: 0,
            }}
            onPress={() => {
              router.navigate({
                pathname: "viewanswers",
                params: {
                  id: item.id,
                  title: item.title,
                },
              });
            }}
          />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, marginHorizontal: 16, marginTop: 20 }}>
      <Spinner visible={loading} />

      <View style={styles.headerContainer}>
        <View style={styles.titleContainer}>
          <AutoSizeText
            fontSizePresets={[23, 20]}
            numberOfLines={1}
            mode={ResizeTextMode.preset_font_sizes}
            style={styles.titleText}
          >
            {title}
          </AutoSizeText>
        </View>
      </View>

      <TextInput
        style={styles.inputField}
        placeholder="Add a question"
        value={question}
        onChangeText={(userText) => setQuestion(userText)}
      />

      {editedquestion ? (
        <TouchableOpacity
          style={{
            backgroundColor: "#4a363b",
            borderRadius: 6,
            paddingVertical: 12,
            marginVertical: 34,
            alignItems: "center",
          }}
          onPress={() => handleUpdatequestion()}
        >
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 20 }}>
            Save
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={{
            backgroundColor: "#4a369b",
            borderRadius: 6,
            paddingVertical: 12,
            marginVertical: 34,
            alignItems: "center",
          }}
          onPress={() => handleAddquestion()}
        >
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 20 }}>
            Add
          </Text>
        </TouchableOpacity>
      )}

      {questions.length > 0 ? (
        <FlatList data={questions} renderItem={renderquestions} />
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <AutoSizeText
            fontSizePresets={[20, 17]}
            numberOfLines={1}
            mode={ResizeTextMode.preset_font_sizes}
            style={{
              color: "#666633",
              marginHorizontal: 20,
              marginBottom: 20,
              fontWeight: "bold",
              borderWidth: 1,
              borderColor: "#689633",
              borderRadius: 5,
              padding: 10,
            }}
          >
            The Quiz Selected Has No Questions!!!
          </AutoSizeText>
        </View>
      )}
    </SafeAreaView>
  );
};

export default QuestionScreen;

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 20,
  },
  titleContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  titleText: {
    color: "#333",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 20,
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
