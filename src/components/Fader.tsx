import VuMeter from "@/components/VuMeter";
import useMeter from "@/hooks/useMeter";
import { Destination } from "tone";
import { PlayerContext } from "@/machines/playerMachine";
import AutomationMode from "./AutomationMode";

export default function Main() {
  const meterVal = useMeter([Destination]);
  const { volume } = PlayerContext.useSelector((state) => state.context);
  const { send } = PlayerContext.useActorRef();

  function setVolume(e: React.FormEvent<HTMLInputElement>): void {
    send({
      type: "setVolume",
      volume: parseFloat(e.currentTarget.value),
    });
  }

  return (
    <div>
      <div className="channel">
        <div className="fader-wrap">
          <div className="window">{`${(volume + 100).toFixed(0)} dB`}</div>
          <VuMeter meterValue={meterVal} height={250} width={25} />
          <input
            className="range-y volume"
            min={-100}
            max={0}
            step={0.1}
            type="range"
            value={volume}
            onChange={setVolume}
          />
          <div className="channel-label">Volume</div>
        </div>
        <AutomationMode />
      </div>
    </div>
  );
}
