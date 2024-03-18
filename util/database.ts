import { FIRESTORE_DB } from "@/ firebaseConfig";
import { showToast } from "@/app-component/Toaster";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query } from "firebase/firestore";

 type QuestionType = {
  id?: string  
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  imageUrl?: string; 
};

type QuestionsType = {
  id: number;
  title: string;
  quiz_id: number;
};

type QuizType = {
  id: string;
  title: string;
  description: string;
};

type AnswerType = {
  id: number;
  title: string;
  question_id: number;
  isCorrect: number;
};

function convertQuizToFirebaseFormat(quizData : QuizType[]) {
  return quizData.map(quiz => ({
    id: quiz.id,
    title: quiz.title,
    description: quiz.description
  }));
}

function convertQuestionsToFirebaseFormat(questionData : QuestionsType[]) {
  return questionData.map(question => ({
    id: question.id,
    title: question.title,
    quiz_id: question.quiz_id
  }));
}

function convertAnswersToFirebaseFormat(answerData : AnswerType[]) {
  return answerData.map(answer => ({
    id: answer.id,
    title: answer.title,
    question_id: answer.question_id,
    isCorrect: answer.isCorrect
  }));
}


// STORE DATA TO THE FIREBASEEEE

export async function storeQuizInFirebase(quizData: QuizType[]) {
  const firebaseData = convertQuizToFirebaseFormat(quizData);
  try {
     // Get all documents in the collection
    const quizRef = collection(FIRESTORE_DB, "Quizzes");
    const querySnapshot = await getDocs(quizRef);

    // Delete each document
    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });

    // Add new documents
    for (const data of firebaseData) {
      await addDoc(quizRef, data);
    }
    // showToast("Quiz stored Successfully!", 2000);
  } catch (error) {
    showToast("Error storing quiz in Firebase:", 2000 , 'red');
    console.error('Error storing data in Firebase:', error);
  }
}

export async function storeQuestionsInFirebase(questionData: QuestionsType[]) {
  const firebaseData = convertQuestionsToFirebaseFormat(questionData);
  try {
    const questionRef = collection(FIRESTORE_DB, "Questions");
    const querySnapshot = await getDocs(questionRef);

    // Delete each document
    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
    for (const data of firebaseData) {
      await addDoc(questionRef, data);
    }
    // showToast("Question stored Successfully!", 2000);
  } catch (error) {
    showToast("Error storing Question in Firebase:", 2000 , 'red');
    console.error('Error storing data in Firebase:', error);
  }
}

export async function storeAnswerInFirebase(answerData: AnswerType[]) {
  const firebaseData = convertAnswersToFirebaseFormat(answerData);
  try {
    const answerRef = collection(FIRESTORE_DB, "Answers");
    const querySnapshot = await getDocs(answerRef);
    // Delete each document
    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
    
    for (const data of firebaseData) {
      await addDoc(answerRef, data);
    }
    // showToast("Answer stored Successfully!", 2000);
  } catch (error) {
    showToast("Error storing Answer in Firebase:", 2000 , 'red');
    console.error('Error storing data in Firebase:', error);
  }
}


 
export const getAllQuizzesFromFirebase = async () => {
  try {
    const quizzesCollectionRef = collection(FIRESTORE_DB, "Quizzes");
    const quizzesQuery = query(quizzesCollectionRef);

    const snapshot = await getDocs(quizzesQuery);

    const quizzes = snapshot.docs.map((doc) => ({
      ...doc.data() as QuizType 
    }));

    return quizzes;
  } catch (error : any) {
    console.error("Error getting quizzes:", error.message);
    throw error;
  }
};

export const getAllQuestionsFromFirebase = async () => {
  try {
    const questionsCollectionRef = collection(FIRESTORE_DB, "Questions");
    const questionsQuery = query(questionsCollectionRef);

    const snapshot = await getDocs(questionsQuery);

    const questions = snapshot.docs.map((doc) => ({
      ...doc.data() as QuestionsType 
    }));

    return questions;
  } catch (error : any) {
    console.error("Error getting questions:", error.message);
    throw error;
  }
};

export const getAllAnswersFromFirebase = async () => {
  try {
    const answersCollectionRef = collection(FIRESTORE_DB, "Answers");
    const answersQuery = query(answersCollectionRef);

    const snapshot = await getDocs(answersQuery);

    const answers = snapshot.docs.map((doc) => ({
      ...doc.data() as AnswerType 
    }));

    return answers;
  } catch (error : any) {
    console.error("Error getting answers:", error.message);
    throw error;
  }
};








export const createQuiz = async (
  title: string,
  description: string,
  setLoading: (value: boolean) => void
): Promise<boolean> => {
      setLoading(true); 
  try {
    const quizRef = collection(FIRESTORE_DB, "Quizzes");
    const docRef = await addDoc(quizRef, {
      title,
      description,
    });

    if(docRef){
     showToast("Quiz Created Successfully!", 2000);
    return true;
    }
     
    return false

  } catch (error : any) {
    showToast("Error: Quiz Creation Failed", 2000, "red");
    console.error("Error creating quiz:", error.message);
    throw error;
  } finally {
    setLoading(false); 
  }

  
};

export const createQuestion = async (
  currentQuizId: string,
  question: QuestionType,
setLoading: (value: boolean) => void
): Promise<boolean> => {
setLoading(true); 
  try {
    // Reference to the quiz document
    const quizDocRef = doc(FIRESTORE_DB, "Quizzes", currentQuizId);

    // Create a new collection "QNA" inside the quiz document
    const qnaCollectionRef = collection(quizDocRef, "QNA");

    // Add the question document to the "QNA" collection
    const questionDocRef = await addDoc(qnaCollectionRef, question);

    if (questionDocRef) {
      showToast("Question added successfully!", 2000);
      return true;
    } 
return false
  } catch (error : any) {
    showToast("Error: Question creation failed", 2000, "red");
    console.error("Error creating question:", error?.message);
    throw error;

  } finally{
        setLoading(false); 
  }
};


export const getQuizById = async (currentQuizId  :string): Promise<QuizType> => {
  try {
    const quizDocRef = doc(FIRESTORE_DB, "Quizzes", currentQuizId);
    const quizSnapshot = await getDoc(quizDocRef);
    if (quizSnapshot.exists()) {
      const quizData = {
        id: quizSnapshot.id,
        ...quizSnapshot.data(),
      };
      return quizData as QuizType;
    } else {
      throw new Error("Quiz not found");
    }
  } catch (error: any) {
    console.error("Error getting quiz by ID:", error.message);
    throw error;
  }
};


export const getQuestionsByQuizId = async (currentQuizId: string): Promise<QuestionType[]> => {
  try {
    const quizDocRef = doc(FIRESTORE_DB, "Quizzes", currentQuizId);
    const qnaCollectionRef = collection(quizDocRef, "QNA");
    const questionsQuery = query(qnaCollectionRef);
    const snapshot = await getDocs(questionsQuery);
    const questions = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return questions as QuestionType[];
  } catch (error: any) {
    console.error("Error getting questions by quiz ID:", error.message);
    throw error;
  }
};


