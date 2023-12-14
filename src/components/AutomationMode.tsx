import { PlayerContext } from "@/machines/playerMachine";
import Toggle from "./Buttons/Toggle";
import { PlayCircle, CircleDot, MinusCircle } from "lucide-react";

function AutomationMode() {
  const { send } = PlayerContext.useActorRef();
  const state = PlayerContext.useSelector((state) => state);

  function setAutomationMode(e: React.FormEvent<HTMLInputElement>): void {
    const val = e.currentTarget.value;
    if (typeof val === "string") return;
    const mode: "read" | "write" | "off" = val;
    send({ type: mode });
  }

  return (
    <div className="flex gap4">
      {/* {automationMode} */}
      <Toggle
        type="radio"
        value="write"
        name="playback-mode"
        onChange={setAutomationMode}
        checked={state.matches({ ready: { automationMode: "writing" } })}
      >
        <CircleDot />
      </Toggle>

      <Toggle
        type="radio"
        value="read"
        name="playback-mode"
        onChange={setAutomationMode}
        checked={state.matches({ ready: { automationMode: "reading" } })}
      >
        <PlayCircle />
      </Toggle>

      <Toggle
        type="radio"
        value="off"
        name="playback-mode"
        onChange={setAutomationMode}
        checked={state.matches({ ready: { automationMode: "off" } })}
      >
        <MinusCircle />
      </Toggle>
    </div>
  );
}

export default AutomationMode;
