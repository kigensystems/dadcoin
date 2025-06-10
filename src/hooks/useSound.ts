import { useRef, useEffect, useState } from 'react';

interface SoundOptions {
  volume?: number;
  loop?: boolean;
}

export const useSound = (url: string, options: SoundOptions = {}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = new Audio(url);
    audio.volume = options.volume ?? 0.5;
    audio.loop = options.loop ?? false;
    audioRef.current = audio;

    const handleEnded = () => setIsPlaying(false);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
      audio.src = '';
    };
  }, [url, options.volume, options.loop]);

  const play = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(err => {
        console.warn('Audio play failed:', err);
      });
      setIsPlaying(true);
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  return { play, pause, stop, isPlaying };
};