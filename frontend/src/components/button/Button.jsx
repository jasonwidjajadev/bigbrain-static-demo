/** Usage:
import Button from './Button';
import { FaPlay } from 'react-icons/fa';

// 1. React icon component
<Button to="/join" icon={FaPlay}>Join a game</Button>

// 2. Custom image icon
<Button icon="/icons/play.svg">Join a game</Button>
<Button icon={require('@/assets/play.png')}>Join a game</Button>

// 3. With extra icon styling
<Button icon="/icons/play.svg" iconClass="w-5 h-5 ml-2">Join a game</Button>

// SVG or PNG as path
<Button icon="/assets/play.svg" iconClass="w-6 h-6">Join</Button>

// Custom local import
import playImg from '@/assets/play.png';
<Button icon={playImg} iconClass="w-4 h-4">Play</Button>

// React icon
import { FaPlay } from 'react-icons/fa';
<Button icon={FaPlay} iconClass="text-[18px]">Start</Button>
*/

import { Link } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

const baseClass =
  `
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
  pink:   'bg-pink-600   hover:bg-pink-400    shadow-[0_4px_0_0_#9c004e] text-white',
  blue:   'bg-blue-600   hover:bg-blue-400    shadow-[0_4px_0_0_#1e3a8a] text-white',
  purple: 'bg-purple-600 hover:bg-purple-400  shadow-[0_4px_0_0_#5901a1] text-white',

  gray:   'bg-gray-300   hover:bg-gray-200    shadow-[0_4px_0_0_#888686] text-black',
  gray500:'bg-gray-500   hover:bg-gray-400    shadow-[0_4px_0_0_#1f2937] text-white',
  orange: 'bg-orange-600 hover:bg-orange-400  shadow-[0_4px_0_0_#c2410c] text-white',
  cyan:   'bg-cyan-600   hover:bg-cyan-400    shadow-[0_4px_0_0_#066b7c] text-white',
  green:  'bg-green-700  hover:bg-green-400   shadow-[0_4px_0_0_#002f15] text-white',
  red:    'bg-red-600  hover:bg-red-400     shadow-[0_4px_0_0_#820008] text-white',
};

export default function Button({
  to,                   // if present, renders <Link>
  type = 'button',      // button type, defaults to 'button'
  onClick,
  disabled = false,

  icon,                 // pass icon component (e.g. FaPlay), or own svg
  iconClass = '',       // optional extra styling for the icon
  children,

  color = 'pink',     // default color variant
  className = '',       // extra class from outside
  ...rest
}) {
  const classes = twMerge(
    baseClass,
    colorVariants[color] || colorVariants.orange,
    disabled ? 'opacity-50 cursor-not-allowed' : '',
    className
  );

  const renderIcon = () => {
    if (!icon) return null;
    const defaultIconClass = 'shrink-0';
    const combinedIconClass = twMerge(defaultIconClass, iconClass || '');

    // Case 1: React icon component
    if (typeof icon === 'function' || typeof icon === 'object') {
      const IconComponent = icon;
      return <IconComponent className={combinedIconClass || 'text-[16px]'} />;
    }

    // Case 2: image icon (PNG/SVG path)
    return (
      <img
        src={icon}
        alt="icon"
        className={combinedIconClass || 'w-5 h-5'}
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

/*
const colorClasses = [
  { base: 'bg-blue-400', hover: 'bg-blue-500', shadow: 'shadow-[0_4px_0_0_#1e3a8a]' },
  { base: 'bg-pink-400', hover: 'bg-pink-500', shadow: 'shadow-[0_4px_0_0_#9d174d]' },
  { base: 'bg-green-400', hover: 'bg-green-500', shadow: 'shadow-[0_4px_0_0_#166534]' },
  { base: 'bg-amber-400', hover: 'bg-amber-500', shadow: 'shadow-[0_4px_0_0_#ca8a04]' },
  { base: 'bg-purple-400', hover: 'bg-purple-500', shadow: 'shadow-[0_4px_0_0_#5901a1]' },
  { base: 'bg-cyan-300', hover: 'bg-cyan-400', shadow: 'shadow-[0_4px_0_0_#066b7c]' },
];
*/