import { LuVideo } from "react-icons/lu";
import { blueButtonClassSmall } from "./tailwind";

const VideoButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex justify-center items-center w-[60%] md:w-[30%] lg:w-[30%] gap-2 ${blueButtonClassSmall}`}
    >
      <LuVideo size={24} />
      <span className="text-sm font-small">Video</span>
    </button>
  );
};

export default VideoButton;
