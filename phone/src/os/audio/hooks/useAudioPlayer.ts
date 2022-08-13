import { useEffect, useRef, useState } from 'react';

interface AudioPlayerProps {
  duration: number;
  currentTime: number;
  playing: boolean;
  play: () => Promise<void>;
  pause: () => void;
}

export const useAudioPlayer = (audioSrc: string): AudioPlayerProps => {
  const [playing, setPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(null);

  const audioRef = useRef<HTMLAudioElement>(new Audio());
  const { duration } = audioRef.current;

  const play = async () => {
    await audioRef.current.play();
    setPlaying(true);
  };

  const pause = () => {
    audioRef.current.pause();
    setPlaying(false);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = audioSrc;
      console.log(audioSrc);
    }
  }, [audioSrc]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.ontimeupdate = (e) => {
        // we need to trunc becuase dayjs does not like decimals
        setCurrentTime(Math.trunc(audioRef.current.currentTime));
      };
    }
  });

  return {
    play,
    pause,
    playing,
    duration,
    currentTime,
  };
};
