import { Pause20Filled, Play20Filled } from "@fluentui/react-icons";
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
    <div className="gap-3 flex items-end min-w-[126px] max-w-[126px]">
      <button
        type="button"
        onClick={handlePlayPause}
        aria-label={isPlaying ? "Pause audio" : "Play audio"}
      >
        {isPlaying ? (
          <Pause20Filled className="cursor-pointer hover:opacity-80" />
        ) : (
          <Play20Filled className="cursor-pointer hover:opacity-80" />
        )}
      </button>
      {!currentName ? (
        <p className="opacity-40">{"<blank>"}</p>
      ) : (
        <p className="text-ellipsis overflow-hidden text-nowrap align-bottom">
          {currentName}
        </p>
      )}
    </div>
  );
};
