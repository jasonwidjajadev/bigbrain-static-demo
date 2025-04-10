import logonoborder from '../assets/logonoborder.png';

const LogoBigRotate = () => {
  return (
    <img src={logonoborder}
      className="h-[75px] sm:h-[95px] shrink-0 transition-transform duration-500 ease-in-out hover:rotate-180" alt="brain-logo"
    />
  );
};

export default LogoBigRotate;
