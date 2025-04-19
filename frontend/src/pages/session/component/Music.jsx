
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import React from 'react';
import music_multiple from '../../../assets/multiple_puzzle-game-bright-casual-video-game-music-249202.mp3';

function Music() {
  const audioRef = React.useRef(null);
  const [volume, setVolume] = React.useState(0.5);
  const [isMuted, setIsMuted] = React.useState(false);
  const [showDropdown, setShowDropdown] = React.useState(false);
  React.useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  React.useEffect(() => {
    const audio = audioRef.current;
    if (audio && !isMuted) {
      audio.play().catch(err => console.warn('Audio blocked:', err));
    }
    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, []);
  React.useEffect(() => {
    if (isMuted && audioRef.current) {
      audioRef.current.pause();
    } else if (!isMuted && audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
  }, [isMuted]);
  return (
    <div className='-mt-1'>
      <audio ref={audioRef} src={music_multiple} loop />
      {/*
        <div className={`${orangeButtonClass} flex items-center gap-3 px-5`} >
        <button onClick={() => setIsMuted(!isMuted)}>
          {isMuted ? <FaVolumeMute className='text-2xl' /> : <FaVolumeUp className='text-2xl'/>}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-7 sm:w-20"
        />
        </div>
      */}
      <div
        className="relative inline-block"
        onMouseEnter={() => setShowDropdown(true)}
        onMouseLeave={() => setShowDropdown(false)}
      >
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="sm:text-xl px-4 py-2 rounded-md bg-orange-500 text-white font-semibold no-underline shadow-[0_4px_0_0_#c2410c] transition-all duration-300 ease-in-out hover:bg-orange-400 flex items-center"
        >
          {isMuted ? <FaVolumeMute className='text-[27px]' /> : <FaVolumeUp className='text-[27px]' />}
        </button>

        {showDropdown && (
          <div
            className="absolute top-full left-1/2 transform -translate-x-1/2 p-2 bg-orange-500 rounded shadow z-50"
            style={{ height: 120 }}
          >
            <Slider
              vertical
              min={0}
              max={1}
              step={0.01}
              value={isMuted ? 0 : volume}
              onChange={(val) => {
                setVolume(val);
                if (val === 0) setIsMuted(true);
                else setIsMuted(false);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Music;