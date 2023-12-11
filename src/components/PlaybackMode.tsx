import { PlayerContext } from "@/machines/playerMachine";
import Toggle from "./Buttons/Toggle";
import { Button } from "./Buttons";
import {
  XCircle,
  PlayCircle,
  CircleDotDashed,
  CircleDot,
  MinusCircle,
} from "lucide-react";

function PlaybackMode() {
  const { send } = PlayerContext.useActorRef();
  const playbackMode = PlayerContext.useSelector((state) => state.context.mode);

  function setPlaybackMode(e: React.FormEvent<HTMLInputElement>): void {
    console.log("message");
    send({
      type: "setPlaybackMode",
      mode: e.currentTarget.value,
    });
  }

  // function clearData() {
  //   console.log("TODO: clear data");
  // }

  return (
    <div className="flex gap4">
      {/* {playbackMode} */}
      <Toggle
        type="radio"
        id={"playback-mode"}
        name={"write"}
        onChange={setPlaybackMode}
        checked={playbackMode === "write"}
        value="write"
      >
        {playbackMode === "write" ? (
          <CircleDotDashed className="rotate" />
        ) : (
          <CircleDot />
        )}
      </Toggle>
      <Toggle
        type="radio"
        id={"playback-mode"}
        name={"read"}
        onChange={setPlaybackMode}
        checked={playbackMode === "read"}
        value="read"
      >
        <PlayCircle />
      </Toggle>
      <Toggle
        type="radio"
        id={"playback-mode"}
        name={"static"}
        onChange={setPlaybackMode}
        checked={playbackMode === "static"}
        value="static"
      >
        <MinusCircle />
      </Toggle>
      {/* <Button onClick={clearData}>
        <XCircle />
      </Button> */}
    </div>
  );
}

export default PlaybackMode;
