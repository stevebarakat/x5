import { PlayerContext } from "@/machines/playerMachine";
import { TransportButton } from "../Buttons";
import { Play as PlayIcon, Pause as PauseIcon } from "lucide-react";

function Play() {
  const { send } = PlayerContext.useActorRef();
  const state = PlayerContext.useSelector((state) => state);

  function handleClick() {
    if (!state.matches({ loaded: { playbackMode: "playing" } })) {
      send({ type: "play" });
    }
    if (state.matches({ loaded: { playbackMode: "playing" } })) {
      send({ type: "pause" });
    }
  }

  return (
    <TransportButton onClick={handleClick}>
      {!state.matches({ loaded: { playbackMode: "playing" } }) ? (
        <PlayIcon />
      ) : (
        <PauseIcon />
      )}
    </TransportButton>
  );
}

export default Play;
