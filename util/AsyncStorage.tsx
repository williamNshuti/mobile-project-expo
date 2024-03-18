import AsyncStorage from "@react-native-async-storage/async-storage";

type UserResponse = {
  email: string;
  family_name: string;
  given_name: string;
  id: string;
  locale: string;
  name: string;
  picture: string;
  verified_email: boolean;
};

export const setItem = async (key: string, value: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.error("Error storing value:", error);
    throw error;
  }
};

export const getItem = async (key: string): Promise<string | null> => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value;
  } catch (error) {
    console.error("Error retrieving value:", error);
    throw error;
  }
};

export const removeItem = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error("Error deleting value:", error);
    throw error;
  }
};

export async function isSessionExpired(
  loggedInTime: string,
  durationInHours: number
): Promise<boolean> {
  const loggedInDate = new Date(loggedInTime);
  const currentTime = new Date();
  const timeDifferenceInMilliseconds =
    currentTime.getTime() - loggedInDate.getTime();
  const timeDifferenceInHours = timeDifferenceInMilliseconds / (1000 * 60 * 60);

  return timeDifferenceInHours > durationInHours;
}
