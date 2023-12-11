import { PlayerContext } from "@/machines/playerMachine";
import Loader from "@/components/Loader";
import Transport from "@/components/Transport";
import Fader from "@/components/Fader";

export default function Player() {
  const loaded = PlayerContext.useSelector((state) => state.matches("loaded"));

  if (loaded) {
    return (
      <div className="flex-y">
        <Fader />
        <Transport />
      </div>
    );
  } else {
    return <Loader />;
  }
}
