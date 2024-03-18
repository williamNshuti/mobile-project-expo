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
import { useLocalSearchParams } from "expo-router";
import {
  AddAnswers,
  DeleteAnswer,
  UpdateAnswer,
  UpdateAnswerStatus,
} from "@/util/sqllite";
import Spinner from "react-native-loading-spinner-overlay";
import { COLORS } from "@/constants/theme";
import { showToast } from "@/app-component/Toaster";
import { AutoSizeText, ResizeTextMode } from "react-native-auto-size-text";

type AnswerType = {
  id: number;
  title: string;
  question_id: number;
  isCorrect: number;
};

const AnswersScreen = () => {
  const [Answer, setAnswer] = useState<any>("");
  const [editedAnswers, setEditedAnswers] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [Answers, setAnswers] = React.useState<AnswerType[]>([]);
  const db = useSQLiteContext();
  const params = useLocalSearchParams();
  const { id, title } = params;

  React.useEffect(() => {
    db.withTransactionAsync(async () => {
      await getData();
    });
  }, [db]);

  async function getData() {
    const result: AnswerType[] = await db.getAllAsync<AnswerType>(
      `SELECT * FROM Answers WHERE question_id = ?;`,
      [parseInt(id as string)]
    );
    setAnswers(result);
  }

  // Handle Add Answer
  const handleAddAnswer = async () => {
    if (Answer.trim() === "") {
      alert("Please Enter The Answer.");
      return;
    }

    const success = await AddAnswers(
      parseInt(id as string),
      Answer,
      setLoading,
      db
    );
    if (success) {
      await getData();
      setAnswer("");
    }
  };

  // Handle Edit Answer

  const handleEditAnswer = (Answer: any) => {
    setEditedAnswers(Answer);
    setAnswer(Answer.title);
  };

  // Handle Update

  const handleUpdateAnswer = () => {
    UpdateAnswer(parseInt(editedAnswers.id), Answer, db).then(async () => {
      await getData();
      setEditedAnswers(null);
      setAnswer("");
    });
  };

  const handleUpdateStatusAnswer = (id: number) => {
    const correctAnswerCount = Answers.filter(
      (answer) => answer.isCorrect === 1
    ).length;
    if (correctAnswerCount > 0) {
      showToast(
        "You can only set one answer to true. Please uncheck one.",
        3000,
        "red"
      );
    } else {
      UpdateAnswerStatus(id, 1, db).then(async () => {
        await getData();
      });
    }
  };

  // Render Answer
  const renderAnswers = ({
    item,
    index,
  }: {
    item: AnswerType;
    index: number;
  }) => {
    return (
      <View
        key={index}
        style={{
          backgroundColor: item.isCorrect === 1 ? COLORS.success : "#336699",
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
            onPress={() => handleEditAnswer(item)}
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
              DeleteAnswer(item.id, db).then(async () => await getData());
            }}
            size={20}
            style={{
              padding: 0,
              margin: 0,
            }}
          />

          <View>
            {item.isCorrect === 1 ? (
              <IconButton
                icon="close-circle"
                iconColor="#fff"
                size={20}
                style={{
                  padding: 0,
                  margin: 0,
                }}
                onPress={() =>
                  UpdateAnswerStatus(item.id, 0, db).then(async () => {
                    await getData();
                  })
                }
              />
            ) : (
              <IconButton
                icon="check-circle"
                iconColor="#fff"
                size={20}
                style={{
                  padding: 0,
                  margin: 0,
                }}
                onPress={() => handleUpdateStatusAnswer(item.id)}
              />
            )}
          </View>
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
        placeholder="Add an answer"
        value={Answer}
        onChangeText={(userText) => setAnswer(userText)}
      />

      {editedAnswers ? (
        <TouchableOpacity
          style={{
            backgroundColor: "#000",
            borderRadius: 6,
            paddingVertical: 12,
            marginVertical: 34,
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.8,
            shadowRadius: 3,
          }}
          onPress={() => handleUpdateAnswer()}
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
          onPress={() => handleAddAnswer()}
        >
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 20 }}>
            Add
          </Text>
        </TouchableOpacity>
      )}

      {Answers.length > 0 ? (
        <FlatList data={Answers} renderItem={renderAnswers} />
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
            This Question Has No Options !!!
          </AutoSizeText>
        </View>
      )}
    </SafeAreaView>
  );
};

export default AnswersScreen;

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
