import { LuVideo } from "react-icons/lu";
import { blueButtonClassSmall } from "./tailwind";
const VideoButton = ({ onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={`w-[60%] md:w-[30%] lg:w-[30%] place-items-center ${blueButtonClassSmall}`}
    >
      <LuVideo size={16} />
      <span className="text-xs font-small">Video</span>
    </button>
  );
};

export default VideoButton;
