import { AudioPlayer } from "../AudioPlayer";
import clsx from "clsx";
import { Toolbar } from "./MainToolbar";

type MenubarProps = {
  addMediaEnabled?: boolean;
  audioPlayerEnabled?: boolean;
};

export const Menubar = ({
  addMediaEnabled,
  audioPlayerEnabled,
}: MenubarProps) => {
  return (
    <div
      className={clsx(
        "px-6 md:px-8 min-h-[64px] h-[64px] md:min-h-[80px] md:h-[80px] flex gap-2 items-center justify-between",
        "bg-bg border-b border-dark-grey"
      )}
    >
      {audioPlayerEnabled && <AudioPlayer />}
      {addMediaEnabled && <Toolbar />}
    </div>
  );
};
