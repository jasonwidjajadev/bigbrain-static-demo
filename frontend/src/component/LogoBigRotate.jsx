import logonoborder from '../assets/logonoborder.png';

export const LogoBigRotate = ({ sizeClass = "h-[70px] sm:h-[95px]", addClassName = ""}) => {
  return (
    <img src={logonoborder}
      className={`${sizeClass} shrink-0 transition-transform duration-500 ease-in-out hover:rotate-180 ${addClassName}`} alt="brain-logo"
    />
  );
};

export default LogoBigRotate;
