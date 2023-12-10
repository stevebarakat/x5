import { PlayerMachineContext } from "@/machines/playerMachine";
import { TransportButton } from "../Buttons";
import { FastForward as FastFwdIcon } from "lucide-react";

export function FastForward() {
  const { send } = PlayerMachineContext.useActorRef();

  return (
    <TransportButton
      onClick={() => {
        send({ type: "fastFwd" });
      }}
    >
      <FastFwdIcon />
    </TransportButton>
  );
}
