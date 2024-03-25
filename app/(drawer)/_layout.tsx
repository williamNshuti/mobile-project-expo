import {
  View,
  Text,
  StyleSheet,
  Image,
  useColorScheme,
  Switch,
  TouchableOpacity,
} from "react-native";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useMemo } from "react";
import { Drawer } from "expo-router/drawer";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { Redirect, router, usePathname } from "expo-router";
import Colors from "@/constants/Colors";
import { useSession } from "@/util/ctx";
import LogoutButton from "@/app-component/Logout";
import { MaterialIcons } from "@expo/vector-icons";
import { Entypo, AntDesign } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

const CustomDrawerContent = (props: any) => {
  const pathname = usePathname();
  const { session, signOut, theme } = props;
  const textColor = theme === "dark" ? Colors.dark.text : Colors.light.text;

  const parsedSession = useMemo(() => {
    if (session) {
      return JSON.parse(session);
    }
    return null;
  }, [session]);

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.container}
    >
      <View>
        {parsedSession && (
          <View style={styles.userInfoWrapper}>
            {/* <Image
              source={{ uri: parsedSession?.picture }}
              style={styles.image}
            /> */}

            <FontAwesome6 name="face-grin-wink" size={30} color="#000" />

            <View style={styles.userDetailsWrapper}>
              <Text style={[styles.userName, { color: textColor }]}>
                {parsedSession?.name || "William NSHUTI"}
              </Text>
              <Text style={[styles.userEmail, { color: textColor }]}>
                {parsedSession?.email}
              </Text>
            </View>
          </View>
        )}
        <DrawerItem
          icon={({ color, size }) => (
            <TabBarIcon name="home" color={pathname == "/" ? "#fff" : "#000"} />
          )}
          label={"Home"}
          labelStyle={[
            styles.navItemLabel,
            { color: pathname == "/" ? "#fff" : "#000" },
          ]}
          style={{ backgroundColor: pathname == "/" ? "#333" : "#fff" }}
          onPress={() => {
            router.push("/");
          }}
        />
      </View>
      <View className="mb-6">
        <LogoutButton
          onPress={() => {
            signOut();
            router.replace("/login");
          }}
        />
      </View>
    </DrawerContentScrollView>
  );
};

export default function Layout() {
  const { session, isLoading, theme, toggleTheme, signOut } = useSession();
  const toggleIcon =
    theme === "dark" ? (
      <Entypo name="light-down" size={25} color="white" />
    ) : (
      <MaterialIcons name="dark-mode" size={25} color="black" />
    );

  // if (isLoading) {
  //   return <Text>Loading...</Text>;
  // }
  // if (!isLoading && !session) {
  //   return <Redirect href="/login" />;
  // }

  return (
    <ThemeProvider value={theme === "dark" ? DarkTheme : DefaultTheme}>
      <Drawer
        drawerContent={(props) => (
          <CustomDrawerContent
            {...props}
            session={session}
            signOut={signOut}
            theme={theme}
          />
        )}
        screenOptions={{ headerShown: true }}
      >
        <Drawer.Screen
          name="(tabs)"
          options={{
            headerShown: true,
            headerTitle: "",
            headerRight: () => (
              <TouchableOpacity
                className="mr-5  "
                onPress={() => toggleTheme()}
              >
                {toggleIcon}
              </TouchableOpacity>
            ),
          }}
        />
        <Drawer.Screen
          name="gallery"
          options={{ headerShown: true, headerTitle: "Image Gallery" }}
        />
        <Drawer.Screen
          name="camera"
          options={{ headerShown: true, headerTitle: "Camera" }}
        />
      </Drawer>
      <StatusBar style={theme == "dark" ? "light" : "dark"} />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  navItemLabel: {
    marginLeft: -20,
    fontSize: 18,
  },
  userInfoWrapper: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    marginBottom: 10,
    alignItems: "center",
  },
  userImg: {
    borderRadius: 40,
  },
  userDetailsWrapper: {
    // marginTop: 25,
    marginLeft: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  userEmail: {
    fontSize: 16,
    fontStyle: "italic",
    textDecorationLine: "underline",
  },
  image: {
    width: 45,
    height: 45,
    borderRadius: 50,
  },

  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
  },

  toggleButton: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
  },
});
