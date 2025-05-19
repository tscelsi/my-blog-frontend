import { Pause16Filled, Play16Filled } from "@fluentui/react-icons";
import { useAudio } from "../hooks/useAudio";

export const AudioPlayer = () => {
  const { play, pause, isPlaying, currentSrc, currentName } = useAudio();
  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else if (currentSrc && currentName) {
      play(currentSrc, currentName);
    } else {
      console.log("not playing");
    }
  };

  return (
    <div className="pt-4 gap-3 flex items-end max-w-[126px]">
      <button
        type="button"
        onClick={handlePlayPause}
        aria-label={isPlaying ? "Pause audio" : "Play audio"}
        className="pb-0.5"
      >
        {isPlaying ? (
          <Pause16Filled className="cursor-pointer hover:opacity-80" />
        ) : (
          <Play16Filled className="cursor-pointer hover:opacity-80" />
        )}
      </button>
      <p className="text-ellipsis overflow-hidden text-nowrap align-bottom">
        {!currentName ? "play something" : currentName}
      </p>
    </div>
  );
};
