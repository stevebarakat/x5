import { PlayerMachineContext } from "@/machines/playerMachine";
import { TransportButton } from "../Buttons";
import { Play as PlayIcon, Pause as PauseIcon } from "lucide-react";

function Play() {
  const { send } = PlayerMachineContext.useActorRef();
  const state = PlayerMachineContext.useSelector((state) => state);

  function handleClick() {
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
