import Papa from "papaparse";

export const parseBigBrainCSV = (file) => {
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
            if (results.data.length === 0) {
              reject(new Error("No data found in CSV file"));
              return;
            }

            try {
              // Process the parsed data
              const quizData = convertBigBrainCSVToQuiz(results.data);
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

const convertBigBrainCSVToQuiz = (csvData) => {
  // Create basic quiz structure with default values
  const quizData = {
    name: "Imported Quiz",
    description: "Quiz imported from CSV",
    thumbnail: "", // Default empty thumbnail
    questions: [],
  };

  // Look for the title and description rows first
  let foundMetadata = false;
  let questionHeaderRowIndex = -1;
  let startIndex = 0;

  // Find Title, Description and Question header row
  for (let i = 0; i < csvData.length; i++) {
    const row = csvData[i];
    const firstColumnValue = row[""];

    if (firstColumnValue === "Title") {
      // Extract the title value which is likely in the next column (_1)
      if (row._1 !== null && row._1 !== undefined) {
        quizData.name = String(row._1);
        foundMetadata = true;
      }
    } else if (firstColumnValue === "Description") {
      // Extract the description from the _1 column
      if (row._1 !== null && row._1 !== undefined) {
        quizData.description = String(row._1);
        foundMetadata = true;
      }
    } else if (
      firstColumnValue === "Question #" ||
      firstColumnValue === "Question Text"
    ) {
      // Found the header row for questions
      questionHeaderRowIndex = i;
      break;
    }
  }

  // If we found the question header row, start processing from the next row
  if (questionHeaderRowIndex !== -1) {
    startIndex = questionHeaderRowIndex + 1;
  } else if (foundMetadata) {
    // If we found metadata but no question header, start from row 3 (typical structure)
    startIndex = 3;
  }

  // Generate a base timestamp for question IDs
  const baseTimestamp = Date.now();

  // Process each row into a question
  for (let i = startIndex; i < csvData.length; i++) {
    const row = csvData[i];

    // If we hit a row where the question text is empty or null, stop processing completely
    if (!row[""] || String(row[""]).trim() === "") {
      break; // Exit the loop entirely
    }

    // Get the question text from the empty string column
    const questionText = row[""];

    // Collect all possible answers (non-empty ones) from _1 to _6
    const answerObjects = [];
    for (let j = 1; j <= 6; j++) {
      const answerKey = `_${j}`;
      const answer = row[answerKey];

      if (answer !== undefined && answer !== null) {
        // Create answer object with same format as in screenshots
        answerObjects.push({
          id: j,
          text: String(answer),
          isCorrect: false, // Will be updated after parsing correct answers
        });
      } else {
        // Add empty answers to maintain array size of 6
        answerObjects.push({
          id: j,
          text: "",
          isCorrect: false,
        });
      }
    }

    // Parse correct answer from _9 column - handle multiple correct answers
    let correctAnswerIndices = [];

    if (row._9 !== undefined && row._9 !== null) {
      const correctAnswerStr = String(row._9);

      // If it contains commas, split by commas
      if (correctAnswerStr.includes(",")) {
        correctAnswerIndices = correctAnswerStr
          .split(",")
          .map((a) => parseInt(a.trim()))
          .filter((id) => !isNaN(id) && id > 0 && id <= answerObjects.length);
      }
      // If it contains spaces, split by spaces
      else if (correctAnswerStr.includes(" ")) {
        correctAnswerIndices = correctAnswerStr
          .split(" ")
          .map((a) => parseInt(a.trim()))
          .filter((id) => !isNaN(id) && id > 0 && id <= answerObjects.length);
      }
      // Otherwise treat as a single value
      else {
        const parsed = parseInt(correctAnswerStr);
        if (!isNaN(parsed) && parsed > 0 && parsed <= answerObjects.length) {
          correctAnswerIndices = [parsed];
        }
      }
    }

    // Default to first answer if no valid correct answers specified
    if (correctAnswerIndices.length === 0 && answerObjects.length > 0) {
      correctAnswerIndices = [1]; // First answer
    }

    // Update isCorrect property for correct answers
    correctAnswerIndices.forEach((idx) => {
      const answerIndex = idx - 1; // Convert from 1-based to 0-based
      if (answerObjects[answerIndex]) {
        answerObjects[answerIndex].isCorrect = true;
      }
    });

    // Map indices to answer array indices (0-based)
    const correctAnswersArray = correctAnswerIndices.map((idx) => idx);

    // Determine question type based on number of correct answers and options
    let questionType;
    const numberOfValidOptions = answerObjects.filter(
      (a) => a.text.trim() !== ""
    ).length;

    if (correctAnswerIndices.length > 1) {
      questionType = "multiple"; // Multiple correct answers
    } else if (numberOfValidOptions === 2) {
      questionType = "judgement"; // Only 2 options and 1 correct answer
    } else {
      questionType = "single"; // Single correct answer with more than 2 options
    }

    // Get time limit from _8 column, or default to 20
    const duration = row._8 || 20;

    // Get points from _7 column, or default to 100
    const points = row._7 || 100;

    // Generate a unique ID for each question based on its position
    // Add the row index to ensure uniqueness within this import
    const uniqueQuestionId = baseTimestamp + (i - startIndex + 1);

    // Create question object in exact format from screenshots
    const question = {
      answers: answerObjects,
      correctAnswers: correctAnswersArray,
      duration: duration,
      // Generate a unique ID for each question
      id: uniqueQuestionId,
      image: "",
      points: points,
      text: questionText,
      type: questionType,
      video: "",
    };

    quizData.questions.push(question);
  }
  return quizData;
};
