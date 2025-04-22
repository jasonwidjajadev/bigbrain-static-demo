import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

import { useAuthContext } from "@/context/useAuthContext";
import { fetchGames, updateAllGames } from "@/util/gamesApi";
import { convertFileToBase64, formatBase64Image } from "@/util/imageUtils";

import LinkLogoNavBar from "@/components/logo/LogoNavBar";
import VideoButton from "@/components/button/VideoButton";
import ImageButton from "@/components/button/ImageButton";
import ImageUploaderModal from "@/components/modals/ImageUploaderModal";
import YouTubeUrlModal from "@/components/modals/YouTubeUrlModal";
import {
  orangeButtonClass,
  cyanButtonClassSmall,
  greyButtonClassSmall,
} from "@/components/ui/tailwind";

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
  // Image and video selection state
  const [showImageModal, setShowImageModal] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [showYouTubeModal, setShowYouTubeModal] = useState(false);
  const [previewVideo, setPreviewVideo] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate("/home");
      return;
    }

    fetchGameData();
  }, [token, quizId]);

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Function to show toast
  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (game && questionId !== "new") {
      // Find existing question
      const existingQuestion = game.questions?.find(
        (q) => q.id === questionIdInt
      );
      if (existingQuestion) {
        setQuestion(existingQuestion);

        // Set preview image if available
        if (existingQuestion.image) {
          setPreviewImage(formatBase64Image(existingQuestion.image));
        }

        // Set preview video if available
        if (existingQuestion.video) {
          setPreviewVideo(existingQuestion.video);
        }

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
    // When switching back to multiple or single choice, restore all 6 answers
    else if (
      question.type === "judgement" &&
      (type === "multiple" || type === "single")
    ) {
      // Get the existing 2 answers from judgement
      const existingAnswers = question.answers;

      // Create a full set of 6 answers, preserving the first 2
      const fullAnswers = [
        ...existingAnswers,
        { id: 3, text: "", isCorrect: false },
        { id: 4, text: "", isCorrect: false },
        { id: 5, text: "", isCorrect: false },
        { id: 6, text: "", isCorrect: false },
      ];

      setQuestion((prev) => ({
        ...prev,
        type,
        answers: fullAnswers,
      }));
    }
    // For other type changes that don't involve judgement
    else {
      setQuestion((prev) => ({
        ...prev,
        type,
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

  const handleImgChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const file = e.target.files[0];
        const fileType = file.type;
        const fileName = file.name.toLowerCase();
        const base64 = await convertFileToBase64(file, true);

        // Detect if this is an SVG file
        const isSvg = fileType === "image/svg+xml" || fileName.endsWith(".svg");

        // Update question with base64 image data
        setQuestion({
          ...question,
          image: base64,
          video: "", // Clear any existing video
        });

        // Set preview image with the correct MIME type
        const mimeType = isSvg ? "image/svg+xml" : "image/jpeg";
        setPreviewImage(formatBase64Image(base64, mimeType));

        // Clear any existing video preview
        setPreviewVideo(null);
        setShowImageModal(false);

        // Close the image selection panel
        setShowImageModal(false);
      } catch (err) {
        console.error("Error converting image:", err);
        setError("Failed to process image");
        showToast("Failed to process image", "error");
      }
    }
  };

  const handleImageButtonClick = () => {
    setShowImageModal(true);
    setShowYouTubeModal(false);
  };

  // Helper function to extract YouTube video ID from URL
  const extractVideoId = (url) => {
    if (!url) return null;
    const match = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    return match ? match[1] : null;
  };

  // Updated handleYouTubeVideoSelect function in QuestionEditor.jsx
  const handleYouTubeVideoSelect = (youtubeUrl) => {
    // Update the question state with just the URL
    setQuestion({
      ...question,
      video: youtubeUrl,
      image: "", // Clear any existing image
    });

    // Set preview state with just the URL
    setPreviewVideo(youtubeUrl);
    console.log("Youtube URL is", youtubeUrl);
    console.log("Preview video", previewVideo);

    // Clear any existing image preview
    setPreviewImage(null);
    // Close the YouTube modal
    setShowYouTubeModal(false);
  };

  const handleVideoButtonClick = () => {
    setShowYouTubeModal(true);
    setShowImageModal(false); // Close image selection if open
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

  const saveQuestion = async (e) => {
    if (e) {
      e.preventDefault();
    }
    // console.log("Save question clicked, with following data: ", question);
    try {
      setLoading(true);

      // Validate the question:
      if (!question.text.trim()) {
        setError("Question text cannot be empty");
        setLoading(false);
        return;
      }

      // Validate answers
      const hasEmptyAnswers = question.answers
        .slice(0, 2)
        .some((answer) => !answer.text.trim());
      if (hasEmptyAnswers) {
        setError("The first two answers must have text");
        setLoading(false);
        return;
      }

      // Ensure at least one answer is correct
      const hasCorrectAnswer = question.answers.some(
        (answer) => answer.isCorrect
      );
      if (!hasCorrectAnswer) {
        showToast("At least one answer must be marked as correct", "error");
        setError("At least one answer must be marked as correct");
        setLoading(false);
        return;
      }

      // Ensure correctAnswers array is properly set
      const correctIds = question.answers
        .filter((answer) => answer.isCorrect)
        .map((answer) => answer.id);

      const finalQuestion = {
        ...question,
        correctAnswers: correctIds,
      };

      const updatedGame = { ...game };

      // Update or add the question
      if (questionId === "new") {
        updatedGame.questions = [
          ...(updatedGame.questions || []),
          finalQuestion,
        ];
      } else {
        updatedGame.questions = updatedGame.questions.map((q) =>
          q.id === questionIdInt ? finalQuestion : q
        );
      }

      // Get all games to update
      const gamesData = await fetchGames(token);
      const updatedGames = gamesData.map((g) =>
        g.id === quizIdInt ? updatedGame : g
      );

      // Update games in the backend
      await updateAllGames({ games: updatedGames }, token);

      // Redirect back to quiz edit page
      navigate(`/quiz/edit/${quizId}`);
    } catch (err) {
      console.error("Error saving question:", err);
      setError("Failed to save question");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#f7f7f7]">
      {/* Toast notifications */}
      {toast && (
        <div className="toast toast-top toast-center z-50">
          <div
            className={`alert ${toast.type === "success" ? "alert-success" : "alert-error"}`}
          >
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav className="flex justify-between items-center px-4 sm:px-8 py-2.5 bg-cyan-200 h-[65px]">
        <LinkLogoNavBar targetPath="/home" />
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
      <main className="flex-1 flex items-center justify-center text-center p-8">
        {/* <div className="flex flex-col w-full gap-5"> */}
        <div className="w-full max-w-7xl">
          <h1 className="text-4xl sm:text-5xl font-semibold text-orange-500 font-Nunito-ExtraBold mb-6 sm:mb-8">
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
                    <p className="validator-hint hidden text-black-900">
                      Must be between be 5 to 60
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4">
                  {/* Cancel button */}
                  <button
                    type="button"
                    onClick={() => navigate(`/quiz/edit/${quizId}`)}
                    className={`${greyButtonClassSmall} px-4 py-2`}
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

              <section className="sm:p-8">
                {/* Question content */}
                <div className="flex flex-col pt-6 sm:pt-0 sm:flex-row gap-4 mb-9">
                  <div className="flex flex-col">
                    <div className="flex flex-row sm:flex-col sm:w-full flex-2 justify-end items-center gap-4 px-6">
                      <ImageButton onClick={handleImageButtonClick} />
                      <VideoButton onClick={handleVideoButtonClick} />
                    </div>
                    {/* Show preview image if available */}
                    {previewImage && (
                      <div className="flex flex-col justify-center mt-2 border rounded p-2">
                        <img
                          src={previewImage}
                          alt="Question image"
                          className="max-w-full h-auto max-h-32"
                        />
                        <button
                          type="button"
                          className="text-xs text-red-600 mt-1"
                          onClick={() => {
                            setPreviewImage(null);
                            setQuestion({ ...question, image: "" });
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    )}

                    {/* Show preview video if available */}
                    {previewVideo && (
                      <div className="flex flex-col justify-center mt-2 border rounded p-2">
                        <div className="aspect-w-16 aspect-h-9">
                          <iframe
                            src={`https://www.youtube.com/embed/${extractVideoId(previewVideo)}`}
                            className="w-full h-24"
                            allowFullScreen
                            title="YouTube video"
                          ></iframe>
                        </div>
                        <div className="text-xs text-gray-500 truncate mt-1">
                          {previewVideo}
                        </div>
                        <button
                          type="button"
                          className="text-xs text-red-600 mt-1"
                          onClick={() => {
                            setPreviewVideo(null);
                            setQuestion({ ...question, video: "" });
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col flex-4">
                    <div className="mb-2 text-2xl font-bold">Question</div>
                    <textarea
                      type="text"
                      value={question.text}
                      onChange={handleQuestionChange}
                      placeholder="Enter your question here..."
                      className="textarea textarea-ghost textarea-info w-full h-24 rounded p-3 text-lg border border-gray-300"
                      required
                    />
                  </div>
                </div>

                {/* Image Uploader Modal */}
                <ImageUploaderModal
                  isOpen={showImageModal}
                  onClose={() => setShowImageModal(false)}
                  onImageSelect={handleImgChange}
                />

                {/* YouTube URL Modal */}
                <YouTubeUrlModal
                  isOpen={showYouTubeModal}
                  onClose={() => setShowYouTubeModal(false)}
                  onVideoSelect={handleYouTubeVideoSelect}
                />

                {/* Answers */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
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
                                handleAnswerChange(
                                  index,
                                  "text",
                                  e.target.value
                                )
                              }
                              placeholder={`Answer ${index + 1} ${isOptional}`}
                              className="bg-transparent border-b border-white w-9/10 py-2 text-white placeholder-white text-center text-l"
                              required={index < 2}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default QuestionEditor;
