import { PlayerMachineContext } from "@/App";
import { loaded } from "tone";
import "./styles.css";

const Spinner = () => {
  const { send } = PlayerMachineContext.useActorRef();

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
