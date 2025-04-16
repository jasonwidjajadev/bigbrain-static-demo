import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuthContext } from "../context/useAuthContext";
import { fetchGames, updateAllGames } from "../util/gamesApi";
import {
  orangeButtonClass,
  cyanButtonClassSmall,
  greyButtonClassSmall,
} from "../component/tailwind";
import LogoNavBar from "../component/LogoNavBar";
import { LuTimer } from "react-icons/lu";
import VideoButton from "../component/VideoButton";
import ImageButton from "../component/ImageButton";

function QuestionEditor() {
  // STATE VARIABLES //////////////////////////
  const { quizId, questionId } = useParams();
  const quizIdInt = parseInt(quizId);
  const questionIdInt = parseInt(questionId);
  const navigate = useNavigate();
  const { token } = useAuthContext();

  // Set the game and question states:
  const [game, setGame] = useState(null);
  const [question, setQuestion] = useState({
    id: questionId === "new" ? Date.now() : questionIdInt,
    type: "multiple", // default: multiple choice
    text: "",
    duration: 20, // default: 20 seconds
    points: 10, // default: 10 points
    video: "",
    image: "",
    answers: [
      { id: 1, text: "", isCorrect: false },
      { id: 2, text: "", isCorrect: false },
      { id: 3, text: "", isCorrect: false },
      { id: 4, text: "", isCorrect: false },
      { id: 5, text: "", isCorrect: false },
      { id: 6, text: "", isCorrect: false },
    ],
    correctAnswers: [], // Array to store correct answer IDs
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate("/home");
      return;
    }

    fetchGameData();
  }, [token, quizId]);

  useEffect(() => {
    if (game && questionId !== "new") {
      // Find existing question
      const existingQuestion = game.questions?.find(
        (q) => q.id === questionIdInt
      );
      if (existingQuestion) {
        setQuestion(existingQuestion);

        // If the existing question doesn't have correctAnswers field, derive it from answers
        if (!existingQuestion.correctAnswers) {
          const correctIds = existingQuestion.answers
            .filter((answer) => answer.isCorrect)
            .map((answer) => answer.id);

          setQuestion((prev) => ({
            ...prev,
            correctAnswers: correctIds,
          }));
        }
      } else if (game) {
        // If question not found, set up a new question
        setQuestion({
          id: Date.now(),
          type: "multiple",
          text: "",
          duration: 20,
          points: 10,
          video: "",
          image: "",
          answers: [
            { id: 1, text: "", isCorrect: false },
            { id: 2, text: "", isCorrect: false },
            { id: 3, text: "", isCorrect: false },
            { id: 4, text: "", isCorrect: false },
            { id: 5, text: "", isCorrect: false },
            { id: 6, text: "", isCorrect: false },
          ],
          correctAnswers: [], // Empty array for correct answer IDs
        });
      }
    }
  }, [game, questionId]);

  // LOGIC IMPLEMENTATION
  const fetchGameData = async () => {
    try {
      setLoading(true);
      const gamesData = await fetchGames(token);
      const currentGame = gamesData.find((g) => g.id === quizIdInt);

      if (!currentGame) {
        setError("Game not found");
        navigate("/dashboard");
        return;
      }

      setGame(currentGame);

      // Initialise questions array if it doesn't exist
      if (!currentGame.questions) {
        currentGame.questions = [];
      }
    } catch (err) {
      console.error("Error fetching game data:", err);
      setError("Failed to load game data");
    } finally {
      setLoading(false);
    }
  };

  const handleTypeChange = (type) => {
    setQuestion({
      ...question,
      type,
    });

    // For judgement questions, limit to 2 answers and ensure only one is correct
    if (type === "judgement") {
      const updatedAnswers = question.answers
        .slice(0, 2)
        .map((answer, index) => ({
          ...answer,
          isCorrect: index === 0, // Make the first answer correct by default
        }));

      setQuestion((prev) => ({
        ...prev,
        type,
        answers: updatedAnswers,
      }));
    }
  };

  const handleDurationChange = (e) => {
    setQuestion({
      ...question,
      duration: parseInt(e.target.value),
    });
  };

  const handlePointsChange = (e) => {
    setQuestion({
      ...question,
      points: parseInt(e.target.value),
    });
  };

  const handleQuestionChange = (e) => {
    setQuestion({
      ...question,
      text: e.target.value,
    });
  };

  const handleAnswerChange = (index, field, value) => {
    const updatedAnswers = [...question.answers];

    if (field === "isCorrect") {
      // For single choice and judgement, only one answer can be correct
      if (question.type === "single" || question.type === "judgement") {
        updatedAnswers.forEach((answer, i) => {
          answer.isCorrect = i === index;
        });
      } else {
        // For multiple choice, toggle the selected answer
        updatedAnswers[index].isCorrect = value;
      }

      // Update correctAnswers array based on the isCorrect flags
      const correctIds = updatedAnswers
        .filter((answer) => answer.isCorrect)
        .map((answer) => answer.id);

      setQuestion({
        ...question,
        answers: updatedAnswers,
        correctAnswers: correctIds,
      });
    } else {
      updatedAnswers[index][field] = value;

      setQuestion({
        ...question,
        answers: updatedAnswers,
      });
    }
  };

  const saveQuestion = async () => {
    // console.log("Save question clicked, with following data: ", question);
    try {
      setLoading(true);

      // Validate the question:
    } catch (err) {
      console.error("Error saving question:", err);
      setError("Failed to save question");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-4 sm:px-8 py-2.5 bg-cyan-200 h-[65px]">
        <Link
          to="/home"
          className="text-orange-500 text-3xl font-bold no-underline"
        >
          <LogoNavBar />
        </Link>
        <div className="flex gap-3 items-center">
          <button
            onClick={() => navigate(`/quiz/edit/${quizId}`)}
            className={orangeButtonClass}
          >
            Back to Quiz
          </button>
          <Link to="/auth/logout" className={`${orangeButtonClass} px-5`}>
            Log out
          </Link>
        </div>
      </nav>

      {/* Question Editor */}
      <div className="flex flex-col justify-start items-center text-center p-4">
        <h1 className="text-4xl font-semibold text-orange-500 font-Nunito-Black mb-4">
          {questionId === "new" ? "Add New Question" : "Edit Question"}
        </h1>
        <form className="w-full" onSubmit={saveQuestion}>
          <div className="w-full bg-white rounded-lg shadow-md mb-6">
            {/* Add question box heading */}
            <div className="flex flex-wrap justify-center md:justify-between items-center bg-orange-200 rounded border-b-3 border-orange-500 px-4 py-2 gap-4">
              <div className="flex gap-4 flex-wrap justify-center">
                {/* Question Type */}
                <div className="flex flex-col items-start">
                  <span className="font-medium">Question Type:</span>
                  {/* TODO: Potentially put in icons */}
                  <select
                    className="select"
                    value={question.type}
                    onChange={(e) => handleTypeChange(e.target.value)}
                  >
                    <option value="multiple">Multiple Choice</option>
                    <option value="single">Single Choice</option>
                    <option value="judgement">Judgement</option>
                  </select>
                </div>

                {/* Points */}
                <div className="flex flex-col items-start">
                  <span className="font-medium">Points:</span>
                  <div>
                    <input
                      type="number"
                      value={question.points}
                      onChange={handlePointsChange}
                      className="input validator"
                      required
                    />
                  </div>
                </div>

                {/* Time Limit */}
                <div className="flex flex-col items-start">
                  <span className="font-medium">Time Limit (seconds):</span>

                  <input
                    type="number"
                    value={question.duration}
                    onChange={handleDurationChange}
                    className="input validator"
                    required
                    min="5"
                    max="60"
                    title="Must be between be 5 to 60"
                  />
                  <p className="validator-hint hidden">
                    Must be between be 5 to 60
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4">
                {/* Cancel button */}
                <button
                  onClick={() => navigate(`/quiz/edit/${quizId}`)}
                  className={`${greyButtonClassSmall} px-2 py-2`}
                >
                  Cancel
                </button>
                {/* Save button */}
                <button
                  type="submit"
                  className={`${cyanButtonClassSmall} px-4 py-2`}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </div>

            {/* Question content */}
            <div className="flex flex-col sm:flex-row mb-6 p-4 gap-4">
              <div className="flex flex-row sm:flex-col flex-2 justify-center items-center gap-4">
                {/* TODO: Make these work */}
                <ImageButton />
                <VideoButton />
              </div>
              <div className="flex flex-col flex-4 lg:px-6">
                <div className="mb-2 text-xl ">Question</div>
                <textarea
                  type="text"
                  value={question.text}
                  onChange={handleQuestionChange}
                  placeholder="Enter your question here..."
                  className="textarea textarea-ghost textarea-info w-full h-24 rounded p-3"
                  required
                />
              </div>
            </div>

            {/* Answers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 px-4">
              {question.answers.map((answer, index) => {
                let bgColor;
                if (index === 0) bgColor = "bg-blue-500";
                else if (index === 1) bgColor = "bg-pink-500";
                else if (index === 2) bgColor = "bg-green-400";
                else if (index === 3) bgColor = "bg-amber-500";
                else if (index === 4) bgColor = "bg-purple-500";
                else bgColor = "bg-zinc-400";

                const isOptional = index > 1 ? "(Optional)" : "";

                return (
                  <div
                    key={answer.id}
                    className={`${bgColor} rounded-lg p-2 relative`}
                  >
                    <div className="flex items-center">
                      <div className="flex items-center">
                        <div className="w-10 h-10 border-2 border-white rounded-md flex items-center justify-center">
                          <input
                            type={
                              question.type === "multiple"
                                ? "checkbox"
                                : "radio"
                            }
                            checked={answer.isCorrect}
                            onChange={(e) =>
                              handleAnswerChange(
                                index,
                                "isCorrect",
                                e.target.checked
                              )
                            }
                            name="correct-answer"
                            className="h-6 w-6"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-center h-full w-full">
                        <input
                          type="text"
                          value={answer.text}
                          onChange={(e) =>
                            handleAnswerChange(index, "text", e.target.value)
                          }
                          placeholder={`Answer ${index + 1} ${isOptional}`}
                          className="bg-transparent border-b border-white w-9/10 py-2 text-white placeholder-white text-center text-xl"
                          required={index < 2}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default QuestionEditor;
