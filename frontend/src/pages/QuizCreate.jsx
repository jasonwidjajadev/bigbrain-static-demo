import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/useAuthContext";
import LogoNavBar from "../component/LogoNavBar";
import { orangeButtonClass } from "../component/tailwind";
import ImgSelection from "../component/ImgSelection";
import { fetchGames, updateAllGames } from "../util/gamesApi";

function AdminQuizCreate() {
  // State of Form data
  const [formData, setFormData] = React.useState({
    title: "",
    description: "",
    image: null,
  });
  // const [loading, setLoading] = React.useState(false);

  const navigate = useNavigate();
  const { token } = useAuthContext();
  React.useEffect(() => {
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
  // async function sumbitCreateJob() {

  const handleSubmit = async () => {
    // e.preventDefault();
    // setLoading(true);

    const gamesData = await fetchGames(localStorage.getItem("bigbrain_token"));
    console.log("Games data is", gamesData);

    // Create new game
    const newGameId = Date.now();
    const newGame = {
      id: newGameId,
      name: formData.title,
      questions: [],
      description: formData.description,
    };
  };

  handleSubmit();

  // Debugging:
  React.useEffect(() => {
    // console.log("formData changed:", formData);
  }, [formData]);

  return (
    <>
      <div className="min-h-screen overflow-y-auto flex flex-col font-sans">
        {/* Navbar */}
        <nav className="flex justify-between items-center px-4 sm:px-8 py-2.5 bg-cyan-200 h-[65px]">
          <Link
            to="/home"
            className="text-orange-500 text-3xl font-bold no-underline"
          >
            <LogoNavBar />
          </Link>
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
