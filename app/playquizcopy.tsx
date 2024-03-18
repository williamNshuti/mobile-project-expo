import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { COLORS } from "../constants/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { getQuestionsByQuizId, getQuizById } from "@/util/database";
import { router, useLocalSearchParams } from "expo-router";
import FormButton from "@/app-component/FormButton";
import ResultModal from "@/app-component/ResultModal";
import Spinner from "react-native-loading-spinner-overlay";

type QuestionType = {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  imageUrl?: string;
  selectedOption?: string; // Adding selectedOption property
  allOptions?: string[]; // Adding allOptions property
};

type QuizType = {
  id: string;
  title: string;
  description: string;
};

const PlayQuizScreen = () => {
  const params = useLocalSearchParams();
  const { id } = params;
  const [currentQuizId, setCurrentQuizId] = useState<string>(id as string);
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [loading, setLoading] = useState(false);

  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [isResultModalVisible, setIsResultModalVisible] = useState(false);

  const getQuizAndQuestionDetails = async () => {
    setLoading(true);
    try {
      // Get Quiz
      const currentQuiz: QuizType = await getQuizById(currentQuizId);
      setTitle(currentQuiz.title);

      // Get Questions for the current quiz
      const questionsData: QuestionType[] = await getQuestionsByQuizId(
        currentQuizId
      );

      // Transform and shuffle options
      const tempQuestions: QuestionType[] = questionsData.map((question) => {
        const allOptions = shuffleArray([
          ...question.incorrect_answers,
          question.correct_answer,
        ]);
        return { ...question, allOptions };
      });

      setQuestions(tempQuestions);
    } catch (error: any) {
      console.error(
        "Error fetching quiz and questions details:",
        error.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getQuizAndQuestionDetails();
  }, []);

  const shuffleArray = (array: string[]): string[] => {
    for (let i = array.length - 1; i > 0; i--) {
      // Generate random number
      let j = Math.floor(Math.random() * (i + 1));

      let temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  };

  const getOptionBgColor = (currentQuestion: any, currentOption: any) => {
    if (currentQuestion.selectedOption) {
      if (currentOption == currentQuestion.selectedOption) {
        if (currentOption == currentQuestion.correct_answer) {
          return COLORS.success;
        } else {
          return COLORS.error;
        }
      } else {
        return COLORS.white;
      }
    } else {
      return COLORS.white;
    }
  };

  const getOptionTextColor = (currentQuestion: any, currentOption: any) => {
    if (currentQuestion.selectedOption) {
      if (currentOption == currentQuestion.selectedOption) {
        return COLORS.white;
      } else {
        return COLORS.black;
      }
    } else {
      return COLORS.black;
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        position: "relative",
      }}
    >
      <Spinner visible={loading} />
      <StatusBar backgroundColor={COLORS.white} barStyle={"dark-content"} />
      {/* Top Bar */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingVertical: 10,
          paddingHorizontal: 20,
          backgroundColor: COLORS.white,
          elevation: 4,
        }}
      >
        {/* Back Icon */}
        <MaterialIcons
          name="arrow-back"
          size={24}
          onPress={() => router.back()}
        />

        {/* Title */}
        <Text style={{ fontSize: 16, marginLeft: 10 }}>{title}</Text>

        {/* Correct and incorrect count */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Correct */}
          <View
            style={{
              backgroundColor: COLORS.success,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderTopLeftRadius: 10,
              borderBottomLeftRadius: 10,
            }}
          >
            <MaterialIcons
              name="check"
              size={14}
              style={{ color: COLORS.white }}
            />
            <Text style={{ color: COLORS.white, marginLeft: 6 }}>
              {correctCount}
            </Text>
          </View>

          {/* Incorrect */}
          <View
            style={{
              backgroundColor: COLORS.error,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderTopRightRadius: 10,
              borderBottomRightRadius: 10,
            }}
          >
            <MaterialIcons
              name="close"
              size={14}
              style={{ color: COLORS.white }}
            />
            <Text style={{ color: COLORS.white, marginLeft: 6 }}>
              {incorrectCount}
            </Text>
          </View>
        </View>
      </View>

      {/* Questions and Options list */}
      <FlatList
        data={questions}
        style={{
          flex: 1,
          backgroundColor: COLORS.background,
        }}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.question}
        renderItem={({ item, index }) => (
          <View
            style={{
              marginTop: 14,
              marginHorizontal: 10,
              backgroundColor: COLORS.white,
              elevation: 2,
              borderRadius: 2,
            }}
          >
            <View style={{ padding: 20 }}>
              <Text style={{ fontSize: 16 }}>
                {index + 1}. {item.question}
              </Text>
              {item.imageUrl != "" ? (
                <Image
                  source={{
                    uri: item.imageUrl,
                  }}
                  resizeMode={"contain"}
                  style={{
                    width: "80%",
                    height: 150,
                    marginTop: 20,
                    marginLeft: "10%",
                    borderRadius: 5,
                  }}
                />
              ) : null}
            </View>
            {/* Options */}
            {item.allOptions &&
              item.allOptions.map((option, optionIndex) => {
                return (
                  <TouchableOpacity
                    key={optionIndex}
                    style={{
                      paddingVertical: 14,
                      paddingHorizontal: 20,
                      borderTopWidth: 1,
                      borderColor: COLORS.border,
                      backgroundColor: getOptionBgColor(item, option),
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "flex-start",
                    }}
                    onPress={() => {
                      if (item.selectedOption) {
                        return null;
                      }
                      if (option == item.correct_answer) {
                        setCorrectCount(correctCount + 1);
                      } else {
                        setIncorrectCount(incorrectCount + 1);
                      }

                      let tempQuestions = [...questions];
                      tempQuestions[index].selectedOption = option;
                      setQuestions([...tempQuestions]);
                    }}
                  >
                    <Text
                      style={{
                        width: 25,
                        height: 25,
                        padding: 2,
                        borderWidth: 1,
                        borderColor: COLORS.border,
                        textAlign: "center",
                        marginRight: 16,
                        borderRadius: 25,
                        color: getOptionTextColor(item, option),
                      }}
                    >
                      {optionIndex + 1}
                    </Text>
                    <Text style={{ color: getOptionTextColor(item, option) }}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                );
              })}
          </View>
        )}
        ListFooterComponent={() =>
          !loading &&
          questions && (
            <FormButton
              labelText="Submit"
              containerStyle={{
                margin: 10,
              }}
              handleOnPress={() => {
                // Show Result modal
                setIsResultModalVisible(true);
              }}
            />
          )
        }
      />

      {/* Result Modal */}
      <ResultModal
        isModalVisible={isResultModalVisible}
        correctCount={correctCount}
        incorrectCount={incorrectCount}
        totalCount={questions.length}
        handleOnClose={() => {
          setIsResultModalVisible(false);
        }}
        handleRetry={() => {
          setCorrectCount(0);
          setIncorrectCount(0);
          getQuizAndQuestionDetails();
          setIsResultModalVisible(false);
        }}
        handleHome={() => {
          router.back();
          setIsResultModalVisible(false);
        }}
      />
    </SafeAreaView>
  );
};

export default PlayQuizScreen;
