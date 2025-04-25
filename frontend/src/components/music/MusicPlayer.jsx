import { useEffect, useRef, useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import Button from '@/components/button/Button';

/**
* Music player component with volume control and mute functionality
*
* @param {Object} props - Component props
* @param {string} [props.src=''] - Audio source URL
* @param {number} [props.initialVolume=0.1] - Initial volume level
* @returns {React.ReactElement} Music player component
*/
function MusicPlayer({ src = '', initialVolume = 0.1 }) {
  const audioRef = useRef(null);
  const [volume, setVolume] = useState(initialVolume);
  const [isMuted, setIsMuted] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;

    const handleCanPlayThrough = () => {
      if (!isMuted) {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log('✅ Audio playback started');
            })
            .catch((error) => {
              console.warn('🚫 Autoplay failed:', error);
            });
        }
      }
    };

    audio.addEventListener('canplaythrough', handleCanPlayThrough);

    return () => {
      audio.removeEventListener('canplaythrough', handleCanPlayThrough);
      audio.pause();
      audio.currentTime = 0;
    };
  }, [volume, isMuted]);

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
    const audio = audioRef.current;
    if (audio) {
      if (audio.paused && !isMuted) {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.warn('🚫 Play failed:', error);
          });
        }
      } else {
        audio.pause();
      }
    }
  };

  return (
    <div className="-mt-1">
      <audio ref={audioRef} src={src} loop preload="auto" />
      <div
        className="relative inline-block"
        onMouseEnter={() => setShowDropdown(true)}
        onMouseLeave={() => setShowDropdown(false)}
      >
        <Button
          aria-label="Background music controls"
          onClick={toggleMute}
          icon={isMuted ? FaVolumeMute : FaVolumeUp }
          iconClass="text-2xl sm:text-[28px]"
          color='pink' className='mt-[1px]'>
        </Button>

        {showDropdown && (
          <div
            className="absolute top-full left-1/2 transform -translate-x-1/2 p-2 bg-pink-600 rounded shadow z-50"
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
                setIsMuted(val === 0);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default MusicPlayer;
