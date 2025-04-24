import { Link } from 'react-router-dom';
import logonoborder from '@/assets/logonoborder.png';

const LinkLogoNavBar= ({targetPath}) => {
  return (
    <Link to={targetPath} className="shrink-0">
      <img
        src={logonoborder}
        className="h-[50px] shrink-0 rounded-md bg-white p-2 shadow-md transition-all duration-300 ease-in-out
        hover:-translate-y-1 hover:shadow-[0_4px_0_0_#df1476]"
        alt="brain-logo"
      />
    </Link>

  );
};

export default LinkLogoNavBar;
