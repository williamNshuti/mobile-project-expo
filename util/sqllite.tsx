import { showToast } from "@/app-component/Toaster";
import { SQLiteDatabase, useSQLiteContext } from "expo-sqlite/next";

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

type QuestionType = {
  id: number;
  title: string;
  quiz_id: number;
};

export const GetAllQuizzes = async (db: SQLiteDatabase) => {
  try {
    const result: QuizType[] = await db.getAllAsync<QuizType>(
      `SELECT * FROM Quizzes;`
    );
    return result;
  } catch (error) {
    showToast("Error Getting Quiz", 2000, "red");
    throw error;
  }
};

export const AddQuiz = async (
  title: string,
  description: string,
  setLoading: (value: boolean) => void,
  db: SQLiteDatabase
): Promise<boolean> => {
  setLoading(true);
  try {
    await db.withTransactionAsync(async () => {
      await db.runAsync(
        `
        INSERT INTO Quizzes (title, description) VALUES (?, ?);
        `,
        [title, description]
      );
      showToast("Quiz Created Successfully", 2000);
    });
    return true;
  } catch (error: any) {
    showToast("Error: Quiz Creation Failed", 2000, "red");
    console.error("Error creating quiz:", error.message);
    throw error;
  } finally {
    setLoading(false);
  }
};

export const DeleteQuiz = async (id: number, db: SQLiteDatabase) => {
  try {
    await db.withTransactionAsync(async () => {
      await db.runAsync(`DELETE FROM Quizzes WHERE id = ?;`, [id]);
    });
    showToast("Quiz Deleted Successfully", 2000);
  } catch (error) {
    console.error("Error deleting quiz:", error);
    showToast("Error deleting quiz", 2000, "red");
    throw error;
  }
};

// QUESTIONS

export const GetAllQuestion = async (db: SQLiteDatabase) => {
  try {
    const result: QuestionType[] = await db.getAllAsync<QuestionType>(
      `SELECT * FROM Questions`
    );
    return result;
  } catch (error) {
    showToast("Error Getting Questions", 2000, "red");
    throw error;
  }
};

export const AddQuestions = async (
  quiz_id: number,
  title: string,
  setLoading: (value: boolean) => void,
  db: SQLiteDatabase
): Promise<boolean> => {
  setLoading(true);
  try {
    await db.withTransactionAsync(async () => {
      await db.runAsync(
        `
        INSERT INTO Questions (quiz_id, title) VALUES (?, ?);
        `,
        [quiz_id, title]
      );
      showToast("Question Created Successfully", 2000);
    });
    return true;
  } catch (error: any) {
    showToast("Error: Question Creation Failed", 2000, "red");
    console.error("Error creating question:", error.message);
    throw error;
  } finally {
    setLoading(false);
  }
};

export const DeleteQuestion = async (id: number, db: SQLiteDatabase) => {
  try {
    await db.withTransactionAsync(async () => {
      await db.runAsync(`DELETE FROM Questions WHERE id = ?;`, [id]);
    });
    showToast("Question Deleted Successfully", 2000);
  } catch (error) {
    console.error("Error deleting Question:", error);
    showToast("Error deleting Question", 2000, "red");
    throw error;
  }
};

export const UpdateQuestion = async (
  id: number,
  newTitle: string,
  db: SQLiteDatabase
) => {
  try {
    await db.withTransactionAsync(async () => {
      await db.runAsync(`UPDATE Questions SET title = ? WHERE id = ?;`, [
        newTitle,
        id,
      ]);
    });
    showToast("Question Updated Successfully", 2000);
  } catch (error) {
    console.error("Error Updating Question:", error);
    showToast("Error updating Question title", 2000, "red");
    throw error;
  }
};

// ANSWERSS

export const GetAllAnswers = async (db: SQLiteDatabase) => {
  try {
    const result: AnswerType[] = await db.getAllAsync<AnswerType>(
      `SELECT * FROM Answers`
    );
    return result;
  } catch (error) {
    showToast("Error Getting Answers", 2000, "red");
    throw error;
  }
};

export const AddAnswers = async (
  question_id: number,
  title: string,
  setLoading: (value: boolean) => void,
  db: SQLiteDatabase
): Promise<boolean> => {
  setLoading(true);
  try {
    await db.withTransactionAsync(async () => {
      await db.runAsync(
        `
        INSERT INTO Answers (question_id, title, isCorrect) VALUES (?, ?, ?);
        `,
        [question_id, title, 0]
      );
      showToast("Answer Created Successfully", 2000);
    });
    return true;
  } catch (error: any) {
    showToast("Error: Answer Creation Failed", 2000, "red");
    console.error("Error creating Answer:", error.message);
    throw error;
  } finally {
    setLoading(false);
  }
};

export const DeleteAnswer = async (id: number, db: SQLiteDatabase) => {
  try {
    await db.withTransactionAsync(async () => {
      await db.runAsync(`DELETE FROM Answers WHERE id = ?;`, [id]);
    });
    showToast("Answers Deleted Successfully", 2000);
  } catch (error) {
    console.error("Error deleting Answers:", error);
    showToast("Error deleting Answers", 2000, "red");
    throw error;
  }
};

export const UpdateAnswer = async (
  id: number,
  newTitle: string,
  db: SQLiteDatabase
) => {
  try {
    await db.withTransactionAsync(async () => {
      await db.runAsync(`UPDATE Answers SET title = ? WHERE id = ?;`, [
        newTitle,
        id,
      ]);
    });
    showToast("Answers Updated Successfully", 2000);
  } catch (error) {
    console.error("Error Updating Answers:", error);
    showToast("Error updating Answers Status", 2000, "red");
    throw error;
  }
};

export const UpdateAnswerStatus = async (
  id: number,
  status: number,
  db: SQLiteDatabase
) => {
  try {
    await db.withTransactionAsync(async () => {
      await db.runAsync(`UPDATE Answers SET isCorrect = ? WHERE id = ?;`, [
        status,
        id,
      ]);
    });
    showToast("Answers Status Updated Successfully", 2000);
  } catch (error) {
    console.error("Error Updating Answers Status:", error);
    showToast("Error updating Answers Status", 2000, "red");
    throw error;
  }
};

// UPDATE THE SQL QUIZ TABLE IN DATABASE FROM FIREBASE RESTORED DATA
export const updateSQLiteQuizzesFromFirebase = async (
  quizzesFromFirebase: QuizType[],
  db: SQLiteDatabase
) => {
  try {
    // Delete existing data from SQLite table
    await db.withTransactionAsync(async () => {
      await db.runAsync(`DELETE FROM Quizzes ;`);
      // Insert new data from Firebase into SQLite table
      for (const quiz of quizzesFromFirebase) {
        await db.runAsync(
          `
        INSERT INTO Quizzes (id, title, description) VALUES (?, ?, ?);
        `,
          [quiz.id, quiz.title, quiz.description]
        );
      }
    });

    // showToast("SQLite Quiz table updated successfully.");
  } catch (error) {
    console.error("Error updating Quiz SQLite table:", error);
    throw error;
  }
};

// UPDATE THE SQL QUESTION TABLE IN DATABASE FROM FIREBASE RESTORED DATA
export const updateSQLiteQuestionFromFirebase = async (
  questionFromFirebase: QuestionType[],
  db: SQLiteDatabase
) => {
  try {
    // Delete existing data from SQLite table
    await db.withTransactionAsync(async () => {
      await db.runAsync(`DELETE FROM Questions ;`);
      // Insert new data from Firebase into SQLite table
      for (const question of questionFromFirebase) {
        await db.runAsync(
          `
        INSERT INTO Questions (id, quiz_id, title) VALUES (?, ?, ?);
        `,
          [question.id, question.quiz_id, question.title]
        );
      }
    });

    // showToast("SQLite Question table updated successfully.");
  } catch (error) {
    console.error("Error updating Question SQLite table:", error);
    throw error;
  }
};

// UPDATE THE SQL ANSWERS TABLE IN DATABASE FROM FIREBASE RESTORED DATA

export const updateSQLiteAnswersFromFirebase = async (
  answerFromFirebase: AnswerType[],
  db: SQLiteDatabase
) => {
  try {
    // Delete existing data from SQLite table
    await db.withTransactionAsync(async () => {
      await db.runAsync(`DELETE FROM Answers ;`);
      // Insert new data from Firebase into SQLite table
      for (const answer of answerFromFirebase) {
        await db.runAsync(
          `
        INSERT INTO Answers (id, question_id, title, isCorrect) VALUES (?, ?, ? , ?);
        `,
          [answer.id, answer.question_id, answer.title, answer.isCorrect]
        );
      }
    });

    // showToast("SQLite Answer table updated successfully.");
  } catch (error) {
    console.error("Error updating Answer SQLite table:", error);
    throw error;
  }
};
