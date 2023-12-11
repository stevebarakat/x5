import { PlayerContext } from "@/machines/playerMachine";
import { loaded } from "tone";
import "./styles.css";

const Spinner = () => {
  const { send } = PlayerContext.useActorRef();

  loaded().then(() => send({ type: "loaded" }));

  return (
    <div className="loader">
      <span>Loading Song...</span>
      <div className="spinner">
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
      </div>
    </div>
  );
};

export default Spinner;
