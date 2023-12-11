import VuMeter from "@/components/VuMeter";
import useMeter from "@/hooks/useMeter";
import { Destination } from "tone";
import { PlayerContext } from "@/machines/playerMachine";
import PlaybackMode from "./PlaybackMode";

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
    <div className="channel">
      <div className="flex-y center fader-wrap">
        <div className="window">{`${volume.toFixed(0)} dB`}</div>
        <div className="levels-wrap">
          <VuMeter meterValue={meterVal} height={350} width={25} />
        </div>
        <div className="vol-wrap">
          <input
            className="range-y volume main"
            min={-100}
            max={0}
            step={0.1}
            type="range"
            value={volume}
            onChange={setVolume}
          />
        </div>
        <div className="channel-label">Volume</div>
      </div>
      <PlaybackMode />
    </div>
  );
}
