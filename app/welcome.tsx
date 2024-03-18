import {
  Dimensions,
  Image,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from "react-native";
import { Text } from "@/components/Themed";
import Lottie from "lottie-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const { width, height } = Dimensions.get("window");
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { useSession } from "@/util/ctx";
import { router } from "expo-router";

WebBrowser.maybeCompleteAuthSession();

export default function Page() {
  const { signIn, session, signOut, theme, toggleTheme } = useSession();
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId:
      "991200331563-hcfe89mbc8q9t71bgdcmilj250b5oru7.apps.googleusercontent.com",
    androidClientId:
      "991200331563-r1r845nmbafjajfmrbbi4b6am2rfuknt.apps.googleusercontent.com",
  });

  useEffect(() => {
    handleEffect();
  }, [response]);

  async function handleEffect() {
    if (!session) {
      if (response?.type === "success") {
        getUserInfo(response?.authentication?.accessToken);
      }
    }
  }

  const getUserInfo = async (token: string | undefined) => {
    if (!token) return;
    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const user = await response.json();
      signIn(JSON.stringify(user));
      // router.replace("/(drawer)/(tabs)");
    } catch (error) {
      alert(`Error Occured: ${error}`);
    }
  };

  return (
    <SafeAreaView className="flex-1 flex-col items-center justify-around bg-white">
      <Lottie
        style={{
          width: 90,
          height: 90,
        }}
        speed={1.5}
        resizeMode="cover"
        source={require("../assets/animations/sticker.json")}
        autoPlay
        loop
      />
      <Lottie
        resizeMode="contain"
        style={styles.lottie}
        source={require("../assets/animations/Animation - 1708213176836.json")}
        autoPlay
        loop
        speed={2}
      />
      <TouchableOpacity
        onPress={() => {
          // promptAsync();
          // signOut();
          // router.replace("/(drawer)/(tabs)");
          router.replace("/project");
        }}
        className="shadow p-3 rounded-full bg-[#50C878] w-[300]"
      >
        <View className="flex-row justify-center items-center space-x-3">
          <Image
            source={require("../assets/images/googleIcon.png")}
            className="h-8 w-8"
          />
          <Text className="text-center text-gray-600 text-lg font-bold">
            Sign In with Google
          </Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fef3c7",
  },
  lottie: {
    width: width * 0.9,
    height: width * 0.4,
  },
  text: {
    fontSize: width * 0.09,
    marginBottom: 20,
  },
  resetButton: {
    backgroundColor: "#34d399",
    padding: 10,
    borderRadius: 10,
  },
  title: {
    fontSize: width * 0.09,
    fontWeight: "900",
    textAlign: "center",
    color: "#2c3e50",
    fontFamily: "Arial",
    textTransform: "uppercase",
    margin: width * 0.01,
  },
});
