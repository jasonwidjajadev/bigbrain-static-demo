import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/useAuthContext";
import LinkLogoNavBar from '../component/LinkLogoNavBar';
import { orangeButtonClass } from "../component/tailwind";
import ImgSelection from "../component/ImgSelection";
import { fetchGames, updateAllGames } from "../util/gamesApi";
import { convertImageToBase64 } from "../util/imageUtils";

function AdminQuizCreate() {
  // State of Form data
  const [formData, setFormData] = React.useState({
    title: "",
    description: "",
    image: null,
  });
  // const [loading, setLoading] = React.useState(false);

  const navigate = useNavigate();
  const { token, email } = useAuthContext();
  React.useEffect(() => {
    console.log("Initial token:", token);
    console.log("Initial email:", email);
    if (!token) navigate("/home");
  }, [token, navigate]);

  //TODO logic
  // Update any form field
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handles image change (passed to ImgSelection component)
  const handleImgChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      console.log(e.target.files[0]);
      setFormData({
        ...formData,
        image: e.target.files[0],
      });
    }
  };

  // const unique_id = Date.now();
  // Sumbit the form and push to database
  // async function sumbitCreateJob()

  const handleSubmit = async (e) => {
    e.preventDefault();
    // setLoading(true);
    try {
      const gamesData = await fetchGames(token);
      console.log("Games data is", gamesData);

      // Turn the image into base64
      // TODO: Image is not saving correctly, need to update this
      let base64Img = null;
      if (formData.image) {
        try {
          base64Img = await convertImageToBase64(formData.image);
        } catch (imgError) {
          console.error("Failed to convert image:", imgError);
        }
      }
      console.log("Image converted to base64", base64Img);

      // Create new game
      const newGameId = Date.now();
      const newGame = {
        id: newGameId,
        owner: email,
        name: formData.title,
        questions: [],
        thumbnail: base64Img,
        description: formData.description,
        active: null,
        oldSessions: [],
      };

      // Append new game to current game data
      const updatedGames = [...gamesData, newGame];
      const updatedGamesObj = { games: updatedGames };

      // Put updated games data back to the database
      const updateResult = await updateAllGames(updatedGamesObj, token);
      if (updateResult.error) {
        throw new Error(updateResult.error);
      }

      // Success! Navigate to the dashboard
      // TODO: Update this to be edit page when we have an edit page
      console.log("Quiz created successfully!");
      navigate(`/dashboard`);

      // Reset the form
      setFormData({
        title: "",
        description: "",
        image: null,
      });

      // Put updated games data back to the database
    } catch (error) {
      console.error("Error creating game:", error);
      // Set error state or show error message
    } finally {
      // setLoading(false);
    }
  };

  // Debugging:
  React.useEffect(() => {
    // console.log("formData changed:", formData);
  }, [formData]);

  return (
    <>
      <div className="min-h-screen overflow-y-auto flex flex-col font-sans">
        {/* Navbar */}
        <nav className="flex justify-between items-center px-4 sm:px-8 py-2.5 bg-cyan-200 h-[65px]">
          <LinkLogoNavBar targetPath="/home" />
          <Link to="/auth/logout" className={`${orangeButtonClass} px-5`}>
            Log out
          </Link>
        </nav>

        {/* Main Content */}
        {/* Quiz creation UI can go here */}
        <div className="flex-1 flex flex-col justify-start items-center text-center p-8">
          <h1 className="text-4xl font-semibold text-orange-500 font-Nunito-Black mb-4">
            Create Quiz
          </h1>
          {/* Quiz creation UI can go here */}
          <form
            onSubmit={handleSubmit}
            className="w-full sm:w-[80%] md:w-[60%] lg:w-[50%]"
          >
            {/* Pass the image handler to the child component */}
            <ImgSelection handleImgChange={handleImgChange} />
            <div className="w-full flex flex-col bg-white w-full border-gray-500 drop-shadow-md/25 rounded-lg p-8 mb-6 items-center justify-center transition-colors">
              {/* Title Field */}
              <div className="mb-6 w-full">
                <div className="flex justify-between items-center mb-2">
                  <label
                    htmlFor="title"
                    className="text-gray-700 text-2xl font-medium text-left"
                  >
                    Title <span className="text-gray-500">(required)</span>
                  </label>
                </div>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Add a descriptive title"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                  required
                />
              </div>

              {/* Description Field */}
              <div className="mb-6 w-full">
                <div className="flex justify-between items-center mb-2">
                  <label
                    htmlFor="description"
                    className="text-gray-700 text-lg font-medium text-left"
                  >
                    Description
                  </label>
                </div>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Tell users about your question set"
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 resize-y"
                />
              </div>

              {/* Submit Button */}
              <div className="mt-6">
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-orange-500 text-white font-semibold rounded-lg shadow-[0_4px_0_0_#c2410c] hover:bg-orange-400 hover:-translate-y-1 transition-all duration-300 ease-in-out"
                >
                  Create Quiz
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default AdminQuizCreate;
