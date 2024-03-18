import React, { useEffect } from "react";
import { useStorageState } from "./useStorageState";
import { useColorScheme } from "react-native";
import * as SecureStore from "expo-secure-store";
import NetInfo from "@react-native-community/netinfo";

type ThemeType = "light" | "dark";

interface AuthContextProps {
  signIn: (user: string) => void;
  signOut: () => void;
  session?: any | null;
  isOnline: string;
  isLoading: boolean;
  theme: ThemeType;
  toggleTheme: () => void;
}

const AuthContext = React.createContext<AuthContextProps>({
  signIn: (user: string) => null,
  signOut: () => null,
  session: null,
  isLoading: false,
  theme: "light",
  toggleTheme: () => null,
  isOnline: "yes",
});

export function useSession() {
  const value = React.useContext(AuthContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }

  return value;
}

export function SessionProvider(props: React.PropsWithChildren) {
  const colorScheme = useColorScheme();
  const [[isLoading, session], setSession] = useStorageState("session");
  const [theme, setTheme] = React.useState<ThemeType>(colorScheme as ThemeType);
  const [isOnline, setIsOnline] = React.useState<string>("yes");
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(async (state) => {
      await SecureStore.setItemAsync(
        "isOnline",
        state.isConnected ? "yes" : "no"
      );
      setIsOnline(state.isConnected ? "yes" : "no");
    });

    // Fetch isOnline initially
    SecureStore.getItemAsync("isOnline").then((value) => {
      setIsOnline(value || "no");
    });

    // Cleanup subscription
    return () => {
      unsubscribe();
    };
  }, []); // Only run on mount
  return (
    <AuthContext.Provider
      value={{
        signIn: (user: string) => {
          setSession(user);
        },
        signOut: () => {
          setSession(null);
        },
        session,
        isLoading,
        theme,
        toggleTheme,
        isOnline,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
