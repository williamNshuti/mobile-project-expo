import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Redirect, Tabs } from "expo-router";
import { Pressable, Text } from "react-native";
import Colors from "@/constants/Colors";
import { FontAwesome6, AntDesign } from "@expo/vector-icons";
import { useSession } from "@/util/ctx";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const { session, isLoading, theme } = useSession();
  // if (isLoading) {
  //   return <Text>Loading...</Text>;
  // }

  // if (!session) {
  //   return <Redirect href="/login" />;
  // }

  // if (session) {
  //   return <Redirect href="/home" />;
  // }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[theme ?? "light"].tint,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="location"
        options={{
          title: "Location",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="location-arrow" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
