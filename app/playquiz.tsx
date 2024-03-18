import React, { useState, useRef } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { COLORS } from "../constants/theme";
import { router, useLocalSearchParams } from "expo-router";
import ResultModal from "@/app-component/ResultModal";
import Spinner from "react-native-loading-spinner-overlay";
import QuizItem from "@/app-component/QuizItems";
import { useSQLiteContext } from "expo-sqlite/next";
import { shuffle } from "lodash";
import { AutoSizeText, ResizeTextMode } from "react-native-auto-size-text";

const { width } = Dimensions.get("window");

type ModifiedQuestionType = {
  question: string;
  correct_answer: string;
  selectedOption?: string;
  allOptions: string[];
};

type QuestionTypes = {
  id: number;
  title: string;
  quiz_id: number;
};

type AnswerType = {
  id: number;
  title: string;
  question_id: number;
  isCorrect: number;
};

const PlayQuizScreen = () => {
  const params = useLocalSearchParams();
  const { id, questionTitle } = params;
  const [questionsLocal, setquestionsLocal] = React.useState<
    ModifiedQuestionType[]
  >([]);
  const db = useSQLiteContext();
  const [loading, setLoading] = useState(false);
  const listRef = useRef<FlatList<ModifiedQuestionType>>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [isResultModalVisible, setIsResultModalVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(1);

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

  React.useEffect(() => {
    db.withTransactionAsync(async () => {
      await getData();
    });
  }, [db]);
  async function getData() {
    try {
      setLoading(true);

      const questionsResult: QuestionTypes[] =
        await db.getAllAsync<QuestionTypes>(
          `SELECT * FROM Questions WHERE quiz_id = ?;`,
          [parseInt(id as string)]
        );

      const questionsWithAnswers = await Promise.all(
        questionsResult.map(async (question) => {
          const answers: AnswerType[] = await db.getAllAsync<AnswerType>(
            `SELECT * FROM Answers WHERE question_id = ?;`,
            [question.id]
          );

          const shuffledAnswers = shuffle(answers);
          const correctAnswer = shuffledAnswers.find(
            (answer) => answer.isCorrect === 1
          )?.title;
          const allOptions = shuffledAnswers.map((answer) => answer.title);

          const modifiedQuestion: ModifiedQuestionType = {
            question: question.title,
            correct_answer: correctAnswer || "",
            allOptions: allOptions || [],
          };

          return modifiedQuestion;
        })
      );
      const questionsAnswers = shuffle(questionsWithAnswers);
      setquestionsLocal(questionsAnswers);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }
  const reset = async () => {
    const updatedQuestions = questionsLocal.map((question) => {
      if (question.selectedOption) {
        const { selectedOption, ...rest } = question;
        return rest;
      }
      return question;
    });
    setquestionsLocal(updatedQuestions);
    setCorrectCount(0);
    setIncorrectCount(0);
    await getData();
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        // backgroundColor: "#b5a567",
      }}
    >
      <Spinner visible={loading} />
      <StatusBar backgroundColor={COLORS.white} barStyle={"dark-content"} />

      <>
        {questionsLocal.length === 0 ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
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
        ) : (
          <>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 20,
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "bold",
                  marginLeft: 20,
                  color: "#000",
                }}
              >
                {questionTitle} :
                {" " + currentIndex + "/" + questionsLocal.length}
              </Text>
              <Text
                style={{
                  marginRight: 20,
                  fontSize: 15,
                  fontWeight: "bold",
                  color: "black",
                }}
                onPress={() => {
                  reset();
                  listRef?.current?.scrollToIndex({ animated: true, index: 0 });
                }}
              >
                Reset
              </Text>
            </View>
            <FlatList
              ref={listRef}
              data={questionsLocal}
              scrollEnabled={false}
              horizontal
              onScroll={(e) => {
                const x = e.nativeEvent.contentOffset.x / width + 1;
                setCurrentIndex(parseInt(x.toFixed(0), 10));
              }}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item) => item.question}
              renderItem={({ item, index }) => {
                return (
                  <QuizItem
                    data={item}
                    selectedOption={(x: any): any => {
                      if (item.selectedOption) {
                        return null;
                      }
                      if (x == item.correct_answer) {
                        setCorrectCount(correctCount + 1);
                      } else {
                        setIncorrectCount(incorrectCount + 1);
                      }
                      let tempQuestions = [...questionsLocal];
                      tempQuestions[index].selectedOption = x;
                      setquestionsLocal([...tempQuestions]);
                    }}
                    currentIndex={currentIndex}
                    getOptionBgColor={getOptionBgColor}
                    getOptionTextColor={getOptionTextColor}
                  />
                );
              }}
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                position: "absolute",
                bottom: 50,
                width: "100%",
              }}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: currentIndex > 1 ? "purple" : "gray",
                  height: 50,
                  width: 100,
                  borderRadius: 10,
                  marginLeft: 20,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() => {
                  if (currentIndex > 1) {
                    listRef?.current?.scrollToIndex({
                      animated: true,
                      index: currentIndex - 2,
                    });
                  }
                }}
              >
                <Text style={{ color: "#fff" }}>Previous</Text>
              </TouchableOpacity>
              {currentIndex == questionsLocal.length ? (
                <TouchableOpacity
                  style={{
                    backgroundColor: questionsLocal[currentIndex - 1]
                      ?.selectedOption
                      ? "green"
                      : "gray",
                    height: 50,
                    width: 100,
                    borderRadius: 10,
                    marginRight: 20,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={() => {
                    if (questionsLocal[currentIndex - 1].selectedOption) {
                      setIsResultModalVisible(true);
                    }
                  }}
                >
                  <Text style={{ color: "#fff" }}>Submit</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={{
                    backgroundColor: questionsLocal[currentIndex - 1]
                      ?.selectedOption
                      ? "purple"
                      : "gray",
                    height: 50,
                    width: 100,
                    borderRadius: 10,
                    marginRight: 20,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={() => {
                    if (questionsLocal[currentIndex - 1].selectedOption) {
                      if (currentIndex < questionsLocal.length) {
                        listRef?.current?.scrollToIndex({
                          animated: true,
                          index: currentIndex,
                        });
                      }
                    }
                  }}
                >
                  <Text style={{ color: "#fff" }}>Next</Text>
                </TouchableOpacity>
              )}
            </View>
          </>
        )}
      </>

      <ResultModal
        isModalVisible={isResultModalVisible}
        correctCount={correctCount}
        incorrectCount={incorrectCount}
        totalCount={questionsLocal.length}
        handleOnClose={() => {
          setIsResultModalVisible(false);
        }}
        handleRetry={async () => {
          setIsResultModalVisible(false);
          await reset();
          listRef?.current?.scrollToIndex({
            animated: true,
            index: 0,
          });
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
