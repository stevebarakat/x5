import { SomeMachineContext } from "./App";

export default function Volume() {
  const { volume } = SomeMachineContext.useSelector((state) => state.context);

  const { send } = SomeMachineContext.useActorRef();

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
      <div className="range-wrap">
        <input
          id="range-input"
          type="range"
          value={volume}
          onChange={(e) =>
            send({
              type: "setVolume",
              volume: parseInt(e.currentTarget.value, 10),
            })
          }
        />
      </div>
      <label htmlFor="range-input">Drag:</label>
    </div>
  );
}
