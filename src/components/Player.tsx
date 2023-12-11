import { PlayerContext } from "@/machines/playerMachine";
import useSong from "../hooks/useSong";
import { nelly } from "../assets/nelly";
import Loader from "@/components/Loader";
import Transport from "@/components/Transport";
import Fader from "@/components/Fader";

export default function Player() {
  // useSong(nelly);
  const isLoading = PlayerContext.useSelector((state) =>
    state.matches("loading")
  );
  if (false) {
    return <Loader />;
  } else {
    return (
      <div className="flex-y">
        <Fader />
        <Transport />
      </div>
    );
  }
}
