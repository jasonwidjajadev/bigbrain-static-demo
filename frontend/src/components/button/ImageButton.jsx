import { LuImage } from "react-icons/lu";
import { blueButtonClassSmall } from "@/components/ui/tailwind";

/**
 * A button component that allows users to add images
 *
 * @param {Object} props - Component props
 * @param {Function} props.onClick - Handler function called when button is clicked
 * @returns {JSX.Element} A button with an image icon and label
 */
const ImageButton = ({ onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Add image"
      className={`flex justify-center items-center w-[60%] md:w-[30%] lg:w-[30%] gap-2 ${blueButtonClassSmall} min-w-[100px]`}
    >
      <LuImage size={24} className="shrink-0" />
      <span className="text-sm font-small">Image</span>
    </button>
  );
};

export default ImageButton;
