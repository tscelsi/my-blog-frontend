import { AudioPlayer } from "../AudioPlayer";
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
    <div className="mx-6 md:mx-8 min-h-[64px] h-[64px] md:min-h-[80px] md:h-[80px] flex gap-2 items-center justify-between">
      {audioPlayerEnabled && <AudioPlayer />}
      {addMediaEnabled && <Toolbar />}
    </div>
  );
};
