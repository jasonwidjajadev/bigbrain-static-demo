import { Link } from "react-router-dom";
import { twMerge } from "tailwind-merge";

/**
 * Button component – can render as a <button> or <Link> depending on `to` prop.
 *
 * ## Usage is:
 * <Button icon={FaPlay} to="/join">Join a game</Button>
 * <Button icon="/img/icon.svg">Join a game</Button>
 *
 * @component
 * @param {Object} props
 * @param {string} [props.to] - If provided, renders a <Link> instead of <button>
 * @param {'button'|'submit'|'reset'} [props.type='button'] - Button type
 * @param {function} [props.onClick] - Click handler
 * @param {boolean} [props.disabled=false] - Whether the button is disabled
 * @param {React.Component|String} [props.icon] - Icon component (e.g. FaPlay) or image path
 * @param {string} [props.iconClass] - Additional Tailwind classes for the icon
 * @param {React.ReactNode} props.children - Button label/content
 * @param {string} [props.color='pink'] - Color variant (e.g., pink, blue, orange)
 * @param {string} [props.className] - Additional Tailwind classes
 * @param {Object} [props.rest] - Any additional props passed to <button> or <Link>
 */
const baseClass = `
  inline-flex items-center gap-2
  -mt-1 sm:text-xl
  font-semibold no-underline
  px-5 py-2
  rounded-md
  bg-gray-200 shadow-[0_4px_0_0_rgba(0,0,0,0.15)] hover:bg-orange-400
  hover:-translate-y-1
  transition-all duration-200 ease-in-out
  `;

const colorVariants = {
  pink: "bg-pink-600   hover:bg-pink-400    shadow-[0_4px_0_0_#9c004e] text-white",
  blue: "bg-blue-600   hover:bg-blue-400    shadow-[0_4px_0_0_#1e3a8a] text-white",
  purple:
    "bg-purple-600 hover:bg-purple-400  shadow-[0_4px_0_0_#5901a1] text-white",

  gray: "bg-gray-300   hover:bg-gray-200    shadow-[0_4px_0_0_#888686] text-black",
  gray500:
    "bg-gray-500   hover:bg-gray-400    shadow-[0_4px_0_0_#1f2937] text-white",
  orange:
    "bg-orange-600 hover:bg-orange-400  shadow-[0_4px_0_0_#c2410c] text-white",
  cyan: "bg-cyan-600   hover:bg-cyan-400    shadow-[0_4px_0_0_#066b7c] text-white",
  green:
    "bg-green-700  hover:bg-green-400   shadow-[0_4px_0_0_#002f15] text-white",
  red: "bg-red-600  hover:bg-red-400     shadow-[0_4px_0_0_#820008] text-white",
};

export default function Button({
  to, // if present, renders <Link>
  type = "button", // button type, defaults to 'button'
  onClick,
  disabled = false,

  icon, // pass icon component (e.g. FaPlay), or own svg
  iconClass = "", // optional extra styling for the icon
  children,

  color = "pink", // default color variant
  className = "", // extra class from outside
  ...rest
}) {
  const classes = twMerge(
    baseClass,
    colorVariants[color] || colorVariants.orange,
    disabled ? "opacity-50 cursor-not-allowed" : "",
    className
  );

  const renderIcon = () => {
    if (!icon) return null;
    const defaultIconClass = "shrink-0";
    const combinedIconClass = twMerge(defaultIconClass, iconClass || "");

    // Case 1: React icon component
    if (typeof icon === "function" || typeof icon === "object") {
      const IconComponent = icon;
      return <IconComponent className={combinedIconClass || "text-[16px]"} />;
    }

    // Case 2: image icon (PNG/SVG path)
    return (
      <img
        src={icon}
        alt="icon"
        className={combinedIconClass || "w-5 h-5"}
        draggable="false"
      />
    );
  };

  const content = (
    <>
      {renderIcon()}
      {children}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      {...rest}
    >
      {content}
    </button>
  );
}
