import { useEffect, useRef } from "react";
import { Player } from "tone";

export type Song = {
  url: string;
  start: number;
  end: number;
};

function usePlayer(song: Song) {
  const player = useRef<Player | null>(null);

  useEffect(() => {
    player.current = new Player(song.url);
    player.current.sync().start().toDestination();
    return () => {
      player.current && player.current.dispose();
    };
  }, [song]);

  return null;
}

export default usePlayer;
