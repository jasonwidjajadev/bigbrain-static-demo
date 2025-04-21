import Papa from "papaparse";

export const parseBigBrainCSV = (
  file,
  quizName = "Imported Quiz",
  quizDescription = "Quiz imported from CSV"
) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        // Parse CSV using PapaParse
        Papa.parse(e.target.result, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: true, // Convert numeric values automatically
          complete: function (results) {
            try {
              // Process the parsed data
              const quizData = convertBigBrainCSVToQuiz(
                results.data,
                quizName,
                quizDescription
              );
              resolve(quizData);
            } catch (error) {
              reject(new Error(`Error processing CSV data: ${error.message}`));
            }
          },
          error: function (error) {
            reject(new Error(`Error parsing CSV: ${error.message}`));
          },
        });
      } catch (error) {
        reject(new Error(`Error reading file: ${error.message}`));
      }
    };

    reader.onerror = () => {
      reject(new Error("Error reading file"));
    };

    reader.readAsText(file);
  });
};

const convertBigBrainCSVToQuiz = (csvData, quizName, quizDescription) => {
  // Create basic quiz structure
  const quizData = {
    name: quizName,
    description: quizDescription,
    thumbnail: "", // Default empty thumbnail
    questions: [],
  };

  // Process each row into a question
  csvData.forEach((row, index) => {
    // Skip rows that don't have a question text
    if (!row["Question Text"] || row["Question Text"].trim() === "") {
      return;
    }

    // Collect all possible answers (non-empty ones)
    const options = [];
    for (let i = 1; i <= 6; i++) {
      const answerKey = `Answer ${i}`;
      if (
        row[answerKey] !== undefined &&
        row[answerKey] !== null &&
        row[answerKey] !== ""
      ) {
        // Convert to string in case it's a number
        options.push(String(row[answerKey]));
      }
    }

    // Parse correct answer - handle multiple formats (comma-separated or individual numbers)
    let correctAnswers = [];
    if (row["Correct Answer(s)"]) {
      // If it contains commas, split by commas
      if (String(row["Correct Answer(s)"]).includes(",")) {
        correctAnswers = String(row["Correct Answer(s)"])
          .split(",")
          .map((a) => parseInt(a.trim()) - 1);
      }
      // If it contains spaces, split by spaces
      else if (String(row["Correct Answer(s)"]).includes(" ")) {
        correctAnswers = String(row["Correct Answer(s)"])
          .split(" ")
          .map((a) => parseInt(a.trim()) - 1);
      }
      // Otherwise treat as a single value or comma-separated list
      else {
        // Special case "1,4" format (no spaces)
        if (String(row["Correct Answer(s)"]).includes(",")) {
          correctAnswers = String(row["Correct Answer(s)"])
            .split(",")
            .map((a) => parseInt(a.trim()) - 1);
        } else {
          // Try to parse as a single number
          const parsed = parseInt(row["Correct Answer(s)"]);
          if (!isNaN(parsed)) {
            correctAnswers = [parsed - 1]; // Convert from 1-based to 0-based index
          }
        }
      }
    }

    // Default to first answer if no correct answer specified
    if (correctAnswers.length === 0 && options.length > 0) {
      correctAnswers = [0];
    }

    // Get single correct answer for the quiz format
    const correctAnswer = correctAnswers.length > 0 ? correctAnswers[0] : 0;

    // Create question object
    const question = {
      id: row["Question #"] || index + 1, // Use Question # or index+1
      type: "multiple-choice", // Default to multiple-choice
      text: row["Question Text"],
      options: options,
      correctAnswer: correctAnswer,
      timeLimit: row["Time Limit (sec)"] || 20, // Default to 20 seconds if not specified
    };

    quizData.questions.push(question);
  });
  console.log("QuizData is", quizData);

  return quizData;
};
