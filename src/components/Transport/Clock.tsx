import { PlayerContext } from "@/machines/playerMachine";
import { Transport as t } from "tone";
import "./style.css";

function Clock() {
  const { song, clock } = PlayerContext.useSelector((state) => state.context);

  if (t.seconds < 0) {
    t.seconds = 0;
  }
  if (t.seconds > song.end) {
    t.stop();
    t.seconds = song.end;
  }

  return (
    <div className="clock">
      <div className="ghost">88:88:88</div>
      {clock}
    </div>
  );
}

export default Clock;
