import { PlayerContext } from "@/machines/playerMachine";
import { TransportButton } from "../Buttons";
import { Play as PlayIcon, Pause as PauseIcon } from "lucide-react";

function Play() {
  const { send } = PlayerContext.useActorRef();
  const state = PlayerContext.useSelector((state) => state);

  function handleClick() {
    console.log("state", state.value);
    if (!state.matches("playing")) {
      send({ type: "play" });
    }
    if (state.matches("playing")) {
      send({ type: "pause" });
    }
  }

  return (
    <TransportButton onClick={handleClick}>
      {!state.matches("playing") ? <PlayIcon /> : <PauseIcon />}
    </TransportButton>
  );
}

export default Play;
