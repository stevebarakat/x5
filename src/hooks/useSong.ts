import { useEffect, useRef } from "react";
import { Channel, Player, Transport as t } from "tone";

type Song = {
  url: string;
  start?: number;
  stop?: number;
};

function useSong(song: Song) {
  const channel = useRef<Channel | null>(null);
  const player = useRef<Player | null>(null);

  console.log("song", song);

  useEffect(() => {
    channel.current = new Channel({ volume: 20 });
    player.current = new Player(song.url);

    player.current.connect(channel.current).sync().start().toDestination();

    return () => {
      player.current && player.current.dispose();
      channel.current && channel.current.dispose();
    };
  }, [song]);

  return { channel: channel.current };
}

export default useSong;
