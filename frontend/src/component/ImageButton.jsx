import { LuImage } from "react-icons/lu";
import { blueButtonClassSmall } from "./tailwind";
const ImageButton = ({ onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={`w-[60%] md:w-[30%] lg:w-[30%] place-items-center ${blueButtonClassSmall}`}
    >
      <LuImage size={16} />
      <span className="text-xs font-small">Image</span>
    </button>
  );
};

export default ImageButton;
