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
    <div className="m-6 md:m-8 h-[64px] md:h-[80px] flex gap-2 items-center justify-between">
      {addMediaEnabled ? <Toolbar /> : <div></div>}
      {audioPlayerEnabled && <AudioPlayer />}
    </div>
  );
};
