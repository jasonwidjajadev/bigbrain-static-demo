import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuthContext } from "../context/useAuthContext";
import { fetchGames, updateAllGames } from "../util/gamesApi";
import {
  orangeButtonClass,
  cyanButtonClassSmall,
  greyButtonClassSmall,
} from "../component/tailwind";
import LogoNavBar from "../component/LogoNavBar";
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
