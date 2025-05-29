import { Pause24Filled, Play24Filled } from "@fluentui/react-icons";
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
          <Pause24Filled className="cursor-pointer hover:opacity-80" />
        ) : (
          <Play24Filled className="cursor-pointer hover:opacity-80" />
        )}
      </button>
      <p className="text-ellipsis text-lg overflow-hidden text-nowrap align-bottom">
        {!currentName ? "play something" : currentName}
      </p>
    </div>
  );
};
