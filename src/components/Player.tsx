import { PlayerMachineContext } from "@/machines/playerMachine";
import useSong from "../useSong";
import { nelly } from "../assets/nelly";
import Loader from "@/components/Loader";
import Play from "@/components/Transport";

export default function Player() {
  const { volume } = PlayerMachineContext.useSelector((state) => state.context);
  const { send } = PlayerMachineContext.useActorRef();
  const { channel } = useSong(nelly);
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
          id="number-input"
          type="number"
          value={volume}
          onChange={(e) =>
            send({
              type: "setVolume",
              volume: parseInt(e.currentTarget.value, 10),
            })
          }
        />
        <Play />
      </div>
    );
  }
}
