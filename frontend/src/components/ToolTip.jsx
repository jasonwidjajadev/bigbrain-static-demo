// A simple tooltip wrapper component
const WithToolTip = ({ children, text }) => {
  return (
    <div className="relative group">
      {children}
      <div className="absolute invisible opacity-0 bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-sm rounded py-1 px-2 mb-1 whitespace-nowrap transition-opacity group-hover:visible group-hover:opacity-100 z-10">
        {text}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
      </div>
    </div>
  );
};

export default WithToolTip;
