import { PlayerContext } from "@/machines/playerMachine";
import useSong from "../hooks/useSong";
import { nelly } from "../assets/nelly";
import Loader from "@/components/Loader";
import Play from "@/components/Transport";
import Fader from "@/components/Fader";

export default function Player() {
  const { volume } = PlayerContext.useSelector((state) => state.context);
  const { send } = PlayerContext.useActorRef();
  useSong(nelly);
  const isLoading = PlayerContext.useSelector((state) =>
    state.matches("loading")
  );
  if (isLoading) {
    return <Loader />;
  } else {
    return (
      <div className="flex-column">
        <Fader />
        <Play />
      </div>
    );
  }
}
