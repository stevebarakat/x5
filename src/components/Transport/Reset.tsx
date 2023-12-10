import { PlayerMachineContext } from "@/machines/playerMachine";
import { TransportButton } from "../Buttons";
import { Square } from "lucide-react";

function Reset() {
  const { send } = PlayerMachineContext.useActorRef();

  return (
    <TransportButton
      onClick={() => {
        send({ type: "reset" });
      }}
    >
      <Square />
    </TransportButton>
  );
}

export default Reset;
