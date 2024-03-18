import { FIREBASE_AUTH, FIRESTORE_DB } from "@/ firebaseConfig";
import { showToast } from "@/app-component/Toaster";
import { router } from "expo-router";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { DocumentData, collection, doc, getDoc, setDoc } from "firebase/firestore";
import Toast from "react-native-root-toast";
import { jwtDecode } from "jwt-decode";


export const signIn = async (email: string, password: string, setLoading: (value: boolean) => void): Promise<DocumentData | undefined> => {
  setLoading(true);

  try {
    const userCredential = await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
    const user = userCredential.user;
    const uid = user.uid;
    const userDocRef = doc(FIRESTORE_DB, "users", uid);
    const userDocSnapshot = await getDoc(userDocRef);
    
    if (userDocSnapshot.exists()) {
      const userData = userDocSnapshot.data();
      return userData;
    } else {
    showToast(`Error: User is not found!!!`, 2000, "red");
    }
  } catch (error : any) {
    const errorCode = error.code;
    const errorMessage = getErrorMessage(errorCode);
    showToast(`Error: Sign In Failed ${errorMessage}`, 2000, "red");
    console.error("Error signing in:", errorMessage);
  } finally {
    setLoading(false);
  }
};

export const createAccount = async (email: string, password: string, setLoading: (value: boolean) => void): Promise<void> => {
  setLoading(true);
  try {
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
    const user = userCredential.user;
    const uid = user.uid;
    const userEmail = user.email;
    const createdAt = user?.metadata?.creationTime ? new Date(user.metadata.creationTime) : new Date();
    const userRef = doc(FIRESTORE_DB, "users", uid);
    await setDoc(userRef, {
      email: userEmail,
      createdAt: createdAt,
      role: 'player'
    });
     showToast("Account Created Successfully!", 2000);
  } catch (error : any) {
    showToast("Error: Sign Up Failed", 2000, "red");
    console.error("Error creating quiz:", error.message);
  } finally {
    setLoading(false);
  }
};




const getErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case "auth/invalid-email":
      return "The email address you entered is invalid.";
    case "auth/wrong-password":
      return "The password you entered is incorrect.";
    case "auth/invalid-credential":
      return "Invalid credentials. Please check your email and password.";
    default:
      return "An unexpected error occurred.";
  }
};


