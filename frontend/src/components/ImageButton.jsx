import { LuImage } from "react-icons/lu";
import { blueButtonClassSmall } from "@/components/tailwind";

const ImageButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex justify-center items-center w-[60%] md:w-[30%] lg:w-[30%] gap-2 ${blueButtonClassSmall}`}
    >
      <LuImage size={24} />
      <span className="text-sm font-small">Image</span>
    </button>
  );
};

export default ImageButton;
