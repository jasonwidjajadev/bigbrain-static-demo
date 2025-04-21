import { LuVideo } from "react-icons/lu";
import { blueButtonClassSmall } from "@/components/ui/tailwind";

const VideoButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex justify-center items-center w-[60%] md:w-[30%] lg:w-[30%] gap-2 ${blueButtonClassSmall} min-w-[100px]`}
    >
      <LuVideo size={24} className="shrink-0"/>
      <span className="text-sm font-small">Video</span>
    </button>
  );
};

export default VideoButton;
