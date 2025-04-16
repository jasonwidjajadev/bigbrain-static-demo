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

  const saveQuestion = () => {
    console.log("Save question clicked");
  };

  const getAnswerColor = (index) => {
    const colors = [
      {
        base: "bg-gray-900",
        hover: "bg-blue-500",
        shadow: "shadow-[0_4px_0_0_#1e3a8a]",
      },
      {
        base: "bg-gray-900",
        hover: "bg-pink-500",
        shadow: "shadow-[0_4px_0_0_#9d174d]",
      },
      {
        base: "bg-gray-900",
        hover: "bg-green-500",
        shadow: "shadow-[0_4px_0_0_#166534]",
      },
      {
        base: "bg-gray-900",
        hover: "bg-amber-500",
        shadow: "shadow-[0_4px_0_0_#ca8a04]",
      },
      {
        base: "bg-gray-900",
        hover: "bg-purple-500",
        shadow: "shadow-[0_4px_0_0_#5901a1]",
      },
      {
        base: "bg-gray-900",
        hover: "bg-cyan-400",
        shadow: "shadow-[0_4px_0_0_#066b7c]",
      },
    ];
    return colors[index % colors.length];
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
        <div className="w-full bg-white rounded-lg shadow-md mb-6">
          {/* Add question box heading */}
          <div className="flex flex-wrap justify-center md:justify-between items-center bg-orange-200 rounded border-b-3 border-orange-500 px-4 py-2 gap-4">
            <div className="flex gap-4 flex-wrap justify-center">
              {/* Question Type */}
              <div className="flex flex-col items-start">
                <span className="font-medium">Question Type:</span>
                {/* TODO: Potentially put in icons */}
                <select
                  defaultValue="multiple"
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
              <button
                onClick={() => navigate(`/quiz/edit/${quizId}`)}
                className={`${greyButtonClassSmall} px-2 py-2`}
              >
                Cancel
              </button>
              <button
                onClick={saveQuestion}
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
              <ImageButton />
              <VideoButton />
            </div>
            <div className="flex flex-col flex-4 lg:px-6">
              <div className="mb-2 font-medium">Question</div>
              <textarea
                type="text"
                value={question.text}
                onChange={handleQuestionChange}
                placeholder="Enter your question here..."
                className="textarea textarea-ghost textarea-info w-full h-24 rounded p-3"
              />
            </div>
          </div>

          {/* Answers */}
          <div>
            <div className="mb-2 font-medium">
              Answers{" "}
              {question.type === "multiple"
                ? "(Select multiple correct answers)"
                : question.type === "judgement"
                  ? "(Select one correct answer)"
                  : "(Select one correct answer)"}
            </div>

            <div className="space-y-4">
              {question.answers.map((answer, index) => (
                <div
                  key={answer.id}
                  className={`flex items-center gap-3 p-3 rounded ${getAnswerColor(index)}`}
                >
                  <input
                    type={question.type === "multiple" ? "checkbox" : "radio"}
                    checked={answer.isCorrect}
                    // onChange={(e) =>
                    //   handleAnswerChange(index, "isCorrect", e.target.checked)
                    // }
                    name="correct-answer"
                    className="h-5 w-5"
                  />
                  <input
                    type="text"
                    value={answer.text}
                    // onChange={(e) =>
                    //   handleAnswerChange(index, "text", e.target.value)
                    // }
                    placeholder={`Answer ${index + 1}`}
                    className="flex-1 border border-gray-300 rounded px-3 py-2"
                  />
                  {question.answers.length > 2 && (
                    <button
                      // onClick={() => removeAnswer(index)}
                      className="text-white hover:text-red-200 font-bold px-2"
                    >
                      X
                    </button>
                  )}
                </div>
              ))}
            </div>

            {question.answers.length < 6 && (
              <button
                // onClick={addAnswer}
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Add Answer{" "}
                {question.answers.length < 6
                  ? `(${6 - question.answers.length} remaining)`
                  : ""}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuestionEditor;
