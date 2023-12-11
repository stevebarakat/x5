import { PlayerContext } from "@/machines/playerMachine";
import { TransportButton } from "../Buttons";
import { Play as PlayIcon, Pause as PauseIcon } from "lucide-react";

function Play() {
  const { send } = PlayerContext.useActorRef();
  const state = PlayerContext.useSelector((state) => state);

  function handleClick() {
    console.log("state", state.value);
    if (!state.matches({ loaded: { playbackMode: "playing" } })) {
      send({ type: "play" });
    }
    if (state.matches({ loaded: { playbackMode: "playing" } })) {
      send({ type: "pause" });
    }
  }

  {
    console.log(
      "state",
      state.matches({ loaded: { playbackMode: "playing" } })
    );
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
