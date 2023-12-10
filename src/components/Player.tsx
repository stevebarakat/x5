import { PlayerMachineContext } from "@/machines/playerMachine";
import useSong from "../hooks/useSong";
import { nelly } from "../assets/nelly";
import Loader from "@/components/Loader";
import Play from "@/components/Transport";
export default function Player() {
  const { volume } = PlayerMachineContext.useSelector((state) => state.context);
  const { send } = PlayerMachineContext.useActorRef();
  useSong(nelly);
  const isLoading = PlayerMachineContext.useSelector((state) =>
    state.matches("loading")
  );
  if (isLoading) {
    return <Loader />;
  } else {
    return (
      <div className="flex-column">
        <label htmlFor="number-input">Input:</label>
        <input
          min={-100}
          max={0}
          step={0.1}
          id="number-input"
          type="range"
          value={volume}
          onChange={(e) => {
            const volume = parseFloat(e.currentTarget.value);
            send({
              type: "setVolume",
              volume,
            });
          }}
        />
        <Play />
      </div>
    );
  }
}
