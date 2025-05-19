import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
} from "react";

type AudioContextType = {
  isPlaying: boolean;
  currentSrc: string | null;
  currentName: string | null;
  play: (src: string, name: string) => void;
  pause: () => void;
};

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string | null>(null);
  const [currentName, setCurrentName] = useState<string | null>(null);

  const play = useCallback((src: string, name: string) => {
    if (audioRef.current) {
      if (audioRef.current.src !== src) {
        audioRef.current.src = src;
      }
      audioRef.current.play();
      setCurrentSrc(src);
      setCurrentName(name);
    }
  }, []);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, []);

  return (
    <AudioContext.Provider value={{ isPlaying, currentSrc, currentName, play, pause }}>
      {children}
      <audio
        ref={audioRef}
        style={{ display: "none" }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      />
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const ctx = useContext(AudioContext);
  if (!ctx) throw new Error("useAudio must be used within an AudioProvider");
  return ctx;
};
