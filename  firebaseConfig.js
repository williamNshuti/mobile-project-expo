import * as firebase from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  getReactNativePersistence,
  initializeAuth,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCjOYqtOT0JQm1oEijJHpjoTyTgr5SAuOo",
  authDomain: "quiz-app-7751e.firebaseapp.com",
  databaseURL: "https://quiz-app-7751e-default-rtdb.firebaseio.com",
  projectId: "quiz-app-7751e",
  storageBucket: "quiz-app-7751e.appspot.com",
  messagingSenderId: "1078466392325",
  appId: "1:1078466392325:web:b84cc611dd8bb7eb47c76c",
  measurementId: "G-F0JH4L7301",
};

let app;
if (firebase.getApps().length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.getApp();
}

export const FIREBASE_APP = app;
export const FIRESTORE_DB = getFirestore(app);
export const FIREBASE_AUTH = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
