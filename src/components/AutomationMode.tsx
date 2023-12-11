import { PlayerContext } from "@/machines/playerMachine";
import Toggle from "./Buttons/Toggle";
import {
  PlayCircle,
  CircleDotDashed,
  CircleDot,
  MinusCircle,
} from "lucide-react";

function AutomationMode() {
  const { send } = PlayerContext.useActorRef();
  const state = PlayerContext.useSelector((state) => state);

  function setAutomationMode(e: React.FormEvent<HTMLInputElement>): void {
    const mode: "read" | "write" | "disable" = e.currentTarget.value;
    console.log("mode", mode);
    console.log(state.matches({ loaded: { automationMode: "disabled" } }));
    console.log("state", state.value.loaded.automationMode);
    send({ type: mode });
  }

  return (
    <div className="flex gap4">
      {/* {automationMode} */}

      <Toggle
        type="radio"
        id="playback-mode"
        name="read"
        onChange={setAutomationMode}
        // onChange={() => send({ type: "read" })}
        checked={state.matches({ loaded: { automationMode: "reading" } })}
        value="read"
      >
        <PlayCircle />
      </Toggle>

      <Toggle
        type="radio"
        id="playback-mode"
        name="write"
        onChange={setAutomationMode}
        // onChange={() => send({ type: "write" })}
        checked={state.matches({ loaded: { automationMode: "writing" } })}
        value="write"
      >
        {state.matches({ loaded: { automationMode: "writing" } }) ? (
          <CircleDotDashed className="rotate" />
        ) : (
          <CircleDot />
        )}
      </Toggle>

      <Toggle
        type="radio"
        id="playback-mode"
        name="off"
        onChange={setAutomationMode}
        // onChange={() => send({ type: "disable" })}
        checked={state.matches({ loaded: { automationMode: "disable" } })}
        value="disabled"
      >
        <MinusCircle />
      </Toggle>
    </div>
  );
}

export default AutomationMode;
