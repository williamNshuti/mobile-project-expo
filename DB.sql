



CREATE TABLE IF NOT EXISTS Quizzes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS Questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  quiz_id INTEGER,
  title TEXT NOT NULL,
  FOREIGN KEY (quiz_id) REFERENCES Quizzes (id)
 );

 CREATE TABLE IF NOT EXISTS Answers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  question_id INTEGER,
  title TEXT NOT NULL,
  isCorrect INTEGER NOT NULL DEFAULT 0 CHECK (isCorrect IN (0, 1)),
  FOREIGN KEY (question_id) REFERENCES Questions (id)
 );


select * from Quizzes;

select * from Questions;

select * from Answers;

SELECT name FROM sqlite_master WHERE type='table';

DROP TABLE IF EXISTS Answers;









INSERT INTO Quizzes (title, description) VALUES ('Math', 'This is Math Quiz');
INSERT INTO Quizzes (title, description) VALUES ('English', 'This is English Quiz');
INSERT INTO Quizzes (title, description) VALUES ('Physics', 'This is Physics quiz');


-- Insert questions for the Math quiz (quiz_id = 1)
INSERT INTO Questions (quiz_id, title) VALUES (1, 'What is the square root of 16?');
INSERT INTO Questions (quiz_id, title) VALUES (1, 'Solve for x: 2x + 3 = 9');

-- Insert questions for the English quiz (quiz_id = 2)
INSERT INTO Questions (quiz_id, title) VALUES (2, 'Who wrote the play "Romeo and Juliet"?');
INSERT INTO Questions (quiz_id, title) VALUES (2, 'What is the past tense of "go"?');

-- Insert questions for the Physics quiz (quiz_id = 3)
INSERT INTO Questions (quiz_id, title) VALUES (3, 'What is Newton''s first law of motion?');
INSERT INTO Questions (quiz_id, title) VALUES (3, 'What is the SI unit of force?');




-- Answers for the Math questions
-- Answer for "What is the square root of 16?" (question_id = 1)
INSERT INTO Answers (question_id, title, isCorrect) VALUES (1, '2', 0); 
INSERT INTO Answers (question_id, title, isCorrect) VALUES (1, '3', 0); 
INSERT INTO Answers (question_id, title, isCorrect) VALUES (1, '4', 1);
INSERT INTO Answers (question_id, title, isCorrect) VALUES (1, '5', 0); 

-- Answer for "Solve for x: 2x + 3 = 9" (question_id = 2)
INSERT INTO Answers (question_id, title, isCorrect) VALUES (2, '3', 1);
INSERT INTO Answers (question_id, title, isCorrect) VALUES (2, '4', 0); 
INSERT INTO Answers (question_id, title, isCorrect) VALUES (2, '5', 0); 
INSERT INTO Answers (question_id, title, isCorrect) VALUES (2, '6', 0); 
