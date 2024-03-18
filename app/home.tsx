import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { COLORS } from "@/constants/theme";
import { router, useLocalSearchParams } from "expo-router";
import Spinner from "react-native-loading-spinner-overlay";
import { AntDesign, Entypo, MaterialIcons } from "@expo/vector-icons";
import { useSQLiteContext } from "expo-sqlite/next";
import {
  DeleteQuiz,
  GetAllAnswers,
  GetAllQuestion,
  GetAllQuizzes,
  updateSQLiteAnswersFromFirebase,
  updateSQLiteQuestionFromFirebase,
  updateSQLiteQuizzesFromFirebase,
} from "@/util/sqllite";
import { useSession } from "@/util/ctx";
import { BottomSheetModal, useBottomSheetModal } from "@gorhom/bottom-sheet";
import CustomBottomSheetModal from "@/app-component/CustombottomSheetModal";
import { AutoSizeText, ResizeTextMode } from "react-native-auto-size-text";
import {
  getAllAnswersFromFirebase,
  getAllQuestionsFromFirebase,
  getAllQuizzesFromFirebase,
  storeAnswerInFirebase,
  storeQuestionsInFirebase,
  storeQuizInFirebase,
} from "@/util/database";
import NetInfo from "@react-native-community/netinfo";
import { showToast } from "@/app-component/Toaster";

type QuizType = {
  id: string;
  title: string;
  description: string;
  docId?: string;
};

type QuestionType = {
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

const HomeScreen = () => {
  const { session } = useSession();
  const [refreshing, setRefreshing] = useState(false);
  const [quizzes, setquizzes] = useState<QuizType[]>([]);
  const [role, setRole] = useState<string | undefined>(undefined);
  const db = useSQLiteContext();

  const bottomSheetRef = useRef<BottomSheetModal | null>(null);
  const { dismiss } = useBottomSheetModal();

  const handlePresentModalPress = () => bottomSheetRef.current?.present();

  useEffect(() => {
    db.withTransactionAsync(async () => {
      setRefreshing(true);
      await getData();
    });
  }, [db]);

  async function getData() {
    const result: QuizType[] = await db.getAllAsync<QuizType>(
      `SELECT * FROM Quizzes;`
    );
    setRefreshing(false);
    setquizzes(result);
  }

  async function HandlePublishChanges() {
    setRefreshing(true);
    try {
      const state = await NetInfo.fetch();
      const connected = state.isConnected;
      if (connected) {
        const quiz = await GetAllQuizzes(db);
        const questions = await GetAllQuestion(db);
        const answers = await GetAllAnswers(db);
        await storeQuizInFirebase(quiz);
        await storeQuestionsInFirebase(questions);
        await storeAnswerInFirebase(answers);
        showToast(
          "You have published changes successfully!!",
          3000,
          "#1a9613",
          "top"
        );
      } else {
        showToast(
          "Sorry! You cannot publish while offline!",
          3000,
          "#669999",
          "top"
        );
      }
    } catch (error) {
      console.error("Error occurred while publishing changes:", error);
      showToast(
        "An error occurred while publishing changes",
        3000,
        "red",
        "top"
      );
    } finally {
      setRefreshing(false);
    }
  }
  async function HardReloadChanges() {
    setRefreshing(true);
    try {
      const state = await NetInfo.fetch();
      const connected = state.isConnected;
      if (connected) {
        const quizes = await getAllQuizzesFromFirebase();
        const questions = await getAllQuestionsFromFirebase();
        const answers = await getAllAnswersFromFirebase();
        await updateSQLiteQuizzesFromFirebase(quizes, db);
        await updateSQLiteQuestionFromFirebase(questions, db);
        await updateSQLiteAnswersFromFirebase(answers, db);
      } else {
        await getData();
      }
    } catch (error) {
      console.error("Error occurred while hard reloading changes:", error);
      showToast(
        "An error occurred while hard reload changes",
        3000,
        "red",
        "top"
      );
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => {
    if (session) {
      const parsedSession = JSON.parse(session);
      setRole(parsedSession.role);
    }
  }, [session]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.background,
        position: "relative",
      }}
    >
      <StatusBar backgroundColor={COLORS.white} barStyle={"dark-content"} />
      {/* <Spinner visible={refreshing} /> */}

      {role === "admin" && quizzes.length > 0 && (
        <View
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "flex-end",
          }}
        >
          <TouchableOpacity
            style={{
              padding: 10,
              borderRadius: 50,
              backgroundColor: COLORS.primary + "20",
              marginLeft: 10,
              marginTop: 10,
            }}
            onPress={HandlePublishChanges}
          >
            <MaterialIcons
              name="published-with-changes"
              size={20}
              color="blue"
            />
          </TouchableOpacity>
        </View>
      )}

      {quizzes.length > 0 ? (
        <FlatList
          data={quizzes}
          onRefresh={HardReloadChanges}
          refreshing={refreshing}
          showsVerticalScrollIndicator={false}
          style={{
            paddingVertical: 20,
          }}
          renderItem={({ item: quiz }) => (
            <View
              style={{
                padding: 20,
                borderRadius: 5,
                marginVertical: 5,
                marginHorizontal: 10,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: COLORS.white,
                elevation: 2,
              }}
            >
              <View style={{ flex: 1, paddingRight: 10 }}>
                <AutoSizeText
                  fontSizePresets={[23, 20]}
                  numberOfLines={1}
                  mode={ResizeTextMode.preset_font_sizes}
                  style={{ color: COLORS.black, fontWeight: "700" }}
                >
                  {quiz.title}
                </AutoSizeText>
                {quiz.description != "" ? (
                  <AutoSizeText
                    fontSize={15}
                    numberOfLines={2}
                    style={{ opacity: 0.5 }}
                    mode={ResizeTextMode.max_lines}
                  >
                    {quiz.description}
                  </AutoSizeText>
                ) : null}
              </View>

              {role && (
                <View style={{ flexDirection: "row" }}>
                  {role === "admin" && (
                    <>
                      <TouchableOpacity
                        style={{
                          borderRadius: 50,
                          backgroundColor: "red",
                          padding: 10,
                          marginRight: 10,
                        }}
                        onPress={() => {
                          DeleteQuiz(parseInt(quiz.id), db).then(
                            async () => await getData()
                          );
                        }}
                      >
                        <MaterialIcons
                          name="delete"
                          size={15}
                          color={COLORS.white}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{
                          borderRadius: 50,
                          backgroundColor: COLORS.primary,
                          padding: 10,
                        }}
                        onPress={() => {
                          router.navigate({
                            pathname: "viewquestions",
                            params: {
                              id: quiz.id,
                              title: quiz.title,
                            },
                          });
                        }}
                      >
                        <AntDesign name="eye" size={15} color={COLORS.white} />
                      </TouchableOpacity>
                    </>
                  )}
                  {role === "player" && (
                    <TouchableOpacity
                      style={{
                        paddingVertical: 10,
                        paddingHorizontal: 30,
                        borderRadius: 50,
                        backgroundColor: COLORS.primary + "20",
                      }}
                      onPress={() => {
                        router.navigate({
                          pathname: "playquiz",
                          params: {
                            id: quiz.id,
                            questionTitle: quiz.title,
                          },
                        });
                      }}
                    >
                      <Text style={{ color: COLORS.primary }}>Play</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          )}
        />
      ) : (
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
            No Questions Found !!!
          </AutoSizeText>
        </View>
      )}

      {/* Button */}
      {role === "admin" && (
        <View
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            style={{
              padding: 13,
              borderRadius: 50,
              backgroundColor: COLORS.primary + "20",
            }}
            onPress={handlePresentModalPress}
          >
            <MaterialIcons name="add" size={28} color="blue" />
          </TouchableOpacity>
        </View>
      )}

      <View>
        <CustomBottomSheetModal
          ref={bottomSheetRef}
          getData={getData}
          dismiss={dismiss}
        />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
