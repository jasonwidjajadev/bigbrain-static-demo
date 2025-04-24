import { Link } from "react-router-dom";
import { FaPlay } from "react-icons/fa";
import { orangeButtonClass } from "@/components/ui/tailwind";

/**
 * A navigation button component that directs users to the game joining interface
 *
 * This component renders a Link styled as an orange button with a play icon.
 * When clicked, it navigates the user to the "/join" route where they can
 * enter a game session.
 *
 * @returns {JSX.Element} A styled Link component that navigates to the join game page
 */
const JoinGameButton = () => {
  return (
    <Link
      to="/join"
      className={`${orangeButtonClass} flex items-center gap-2 px-5`}
    >
      <FaPlay className="text-[16px]" />
      Join a game
    </Link>
  );
};

export default JoinGameButton;
