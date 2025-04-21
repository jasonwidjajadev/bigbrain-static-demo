import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const baseClass = `-mt-1 sm:text-xl px-4 py-2 rounded-md bg-orange-500 text-white font-semibold no-underline
  shadow-[0_4px_0_0_#c2410c] transition-all duration-300 ease-in-out
  hover:bg-orange-400 hover:-translate-y-1`;

export default function OrangeButton({ to, onClick, disabled, icon, children, type = 'button' }) {
  const content = (
    <span className="flex items-center justify-center gap-2">
      {children}
      {icon && <span className="text-lg">{icon}</span>}
    </span>
  );

  if (to) {
    return (
      <Link
        to={to}
        className={baseClass}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={baseClass}
      disabled={disabled}>
      {content}
    </button>
  );
}

OrangeButton.propTypes = {
  to: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  icon: PropTypes.element,
  children: PropTypes.node.isRequired,
  type: PropTypes.string,
};
