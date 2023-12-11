import { useEffect, useRef, useCallback, useState } from "react";
import { PlayerContext } from "@/machines/playerMachine";
import { formatMilliseconds } from "@/utils";
import { Transport as t } from "tone";
import "./style.css";

function Clock() {
  const { song } = PlayerContext.useSelector((state) => state.context);
  const animation = useRef<number | null>(null);
  const [clock, setClock] = useState(formatMilliseconds(0));

  if (t.seconds < 0) {
    t.seconds = 0;
  }
  if (t.seconds > song.end) {
    t.stop();
    t.seconds = song.end;
  }

  const animateClock = useCallback(() => {
    animation.current = requestAnimationFrame(animateClock);
    setClock(formatMilliseconds(t.seconds));
  }, []);

  useEffect(() => {
    requestAnimationFrame(animateClock);

    return () => {
      if (animation.current === null) return;
      cancelAnimationFrame(animation.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="clock">
      <div className="ghost">88:88:88</div>
      {clock}
    </div>
  );
}

export default Clock;
