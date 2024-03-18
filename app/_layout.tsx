import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Redirect, Stack, router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { SessionProvider, useSession } from "@/util/ctx";
import { RootSiblingParent } from "react-native-root-siblings";
import NetInfo from "@react-native-community/netinfo";
import * as SecureStore from "expo-secure-store";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { FIREBASE_APP } from "@/ firebaseConfig";
import { SQLiteProvider, useSQLiteContext } from "expo-sqlite/next";
import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import registerNNPushToken, { getPushDataObject } from "native-notify";
import { isSessionExpired } from "@/util/AsyncStorage";
import Toast from "react-native-root-toast";
import {
  getAllQuizzesFromFirebase,
  getAllAnswersFromFirebase,
  getAllQuestionsFromFirebase,
} from "@/util/database";
import {
  updateSQLiteAnswersFromFirebase,
  updateSQLiteQuestionFromFirebase,
  updateSQLiteQuizzesFromFirebase,
} from "@/util/sqllite";

type UserData = {
  createdAt: { seconds: number; nanoseconds: number };
  email: string;
  role: string;
  loggedInTime: string;
};

const loadDatabase = async () => {
  const dbName = "mySQLiteDB.db";
  const dbAsset = require("../assets/mySQLiteDB.db");
  const dbUri = Asset.fromModule(dbAsset).uri;
  const dbFilePath = `${FileSystem.documentDirectory}SQLite/${dbName}`;

  const fileInfo = await FileSystem.getInfoAsync(dbFilePath);
  if (!fileInfo.exists) {
    await FileSystem.makeDirectoryAsync(
      `${FileSystem.documentDirectory}SQLite`,
      { intermediates: true }
    );
    await FileSystem.downloadAsync(dbUri, dbFilePath);
  }
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isOnline, setIsOnline] = React.useState<boolean>(true);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [dbLoaded, setDbLoaded] = React.useState<boolean>(false);
  const [session, setsession] = React.useState<UserData | null>();
  const [user, setUser] = React.useState<any>(null);
  registerNNPushToken(20219, "GMmAuG6Yvmx3RfQDY9PNWF");
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    const getSessionAsync = async () => {
      const value = await SecureStore.getItemAsync("session");
      if (value) {
        const userData = JSON.parse(value);
        const loggedInTime = userData.loggedInTime;
        const isExpired = await isSessionExpired(loggedInTime, 24);

        if (isExpired) {
          await SecureStore.deleteItemAsync("session");
          router.replace("/login");
        }
        setsession(userData);
      } else {
        setsession(null);
        router.replace("/login");
      }
    };
    getSessionAsync();
  }, []);

  useEffect(() => {
    const auth = getAuth(FIREBASE_APP);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    loadDatabase()
      .then(() => setDbLoaded(true))
      .catch((e) => console.error(e));
  }, []);
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(async (state) => {
      await SecureStore.setItemAsync(
        "isOnline",
        state.isConnected ? "yes" : "no"
      );

      setIsOnline(state.isConnected || false);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  let pushDataObject = getPushDataObject();
  useEffect(() => {
    const screenName = pushDataObject.screenName;
    if (screenName && session) {
      if (typeof screenName === "string") {
        router.replace(`/${screenName}` as `${string}:${string}`);
      }
    }
  }, [pushDataObject]);

  if (!loaded) {
    return null;
  }

  if (!loaded || loading || !dbLoaded) {
    return <LoadingScreen />;
  }

  return (
    <SessionProvider>
      <React.Suspense
        fallback={
          <View style={{ flex: 1 }}>
            <ActivityIndicator size={"large"} />
            <Text>Loading Database...</Text>
          </View>
        }
      >
        <SQLiteProvider databaseName="mySQLiteDB.db" useSuspense>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>
              <Toast
                visible={isOnline === false}
                duration={Toast.durations.SHORT}
                position={Toast.positions.TOP}
                shadow={true}
                animation={true}
                hideOnPress={true}
                backgroundColor="red"
              >
                You Are Offline! 🚫
              </Toast>
              <RootLayoutNav session={session} isOnline={isOnline} />
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
        </SQLiteProvider>
      </React.Suspense>
    </SessionProvider>
  );
}

function RootLayoutNav({
  session,
  isOnline,
}: {
  session: UserData | null | undefined;
  isOnline: boolean;
}) {
  const db = useSQLiteContext();
  const [dataSynchronisation, setDataSynchronisation] =
    React.useState<boolean>(false);

  useEffect(() => {
    if (!isOnline) return;
    const fetchData = async () => {
      setDataSynchronisation(true);
      try {
        const quizes = await getAllQuizzesFromFirebase();
        const questions = await getAllQuestionsFromFirebase();
        const answers = await getAllAnswersFromFirebase();
        await updateSQLiteQuizzesFromFirebase(quizes, db);
        await updateSQLiteQuestionFromFirebase(questions, db);
        await updateSQLiteAnswersFromFirebase(answers, db);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setDataSynchronisation(false);
      }
    };

    fetchData();
  }, [db]);

  if (dataSynchronisation) {
    return <LoadingScreen />;
  }
  return (
    <RootSiblingParent>
      <Stack initialRouteName={session ? "home" : "login"}>
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
        <Stack.Screen name="project" options={{ headerShown: true }} />
        <Stack.Screen name="quiz" options={{ headerShown: true }} />
        <Stack.Screen name="welcome" options={{ headerShown: true }} />
        <Stack.Screen
          name="create"
          options={{ headerShown: false, presentation: "modal" }}
        />
        <Stack.Screen name="addquestion" options={{ headerShown: false }} />
        <Stack.Screen
          name="home"
          options={{
            headerShown: true,
            title: "Quiz List",
            headerRight: () => (
              <TouchableOpacity
                style={{
                  borderRadius: 50,
                  backgroundColor: "#0a2b18",
                  padding: 10,
                }}
                onPress={async () => {
                  await SecureStore.deleteItemAsync("session").then(() =>
                    router.replace("/login")
                  );
                }}
              >
                <AntDesign name="logout" size={15} color={COLORS.white} />
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name="playquiz"
          options={{ headerShown: true, title: "Playing Quiz" }}
        />
        <Stack.Screen
          name="viewquestions"
          options={{ headerShown: true, title: "Questions" }}
        />
        <Stack.Screen
          name="viewanswers"
          options={{ headerShown: true, title: "Answers" }}
        />

        <Stack.Screen name="playquizcopy" options={{ headerShown: false }} />
      </Stack>
    </RootSiblingParent>
  );
}

function LoadingScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="blue" />
    </View>
  );
}
