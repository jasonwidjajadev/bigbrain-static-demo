import logonoborder from '@/assets/logonoborder.png';

/**
* A rotating logo component that rotattes on hover
* 
* @param {Object} props - Component props
* @param {string} [props.sizeClass="h-[70px] sm:h-[95px]"] - CSS classes for controlling logo size at different breakpoints
* @param {string} [props.addClassName=""] - Additional CSS classes to apply to the image element
* @returns {JSX.Element} An image element that rotates 180 degrees on hover
*/
export const LogoBigRotate = ({ sizeClass = "h-[70px] sm:h-[95px]", addClassName = ""}) => {
  return (
    <img src={logonoborder}
      className={`${sizeClass} shrink-0 transition-transform duration-500 ease-in-out hover:rotate-180 ${addClassName}`} alt="brain-logo"
    />
  );
};

export default LogoBigRotate;
