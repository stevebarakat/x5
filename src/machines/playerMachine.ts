import { createActorContext } from "@xstate/react";
import { assign, createMachine, fromPromise } from "xstate";
import { dbToPercent, log } from "@/utils";
import { nelly } from "@/assets/nelly";
import type { Song } from "@/hooks/usePlayer";
import {
  start as initializeAudio,
  getContext as getAudioContext,
  Transport,
  Destination,
  Player,
  loaded,
} from "tone";

const audio = getAudioContext();

type InitialConext = {
  song: Song;
  volume: number;
  mode: "off" | "read" | "write";
  player: Player | undefined;
  t: typeof Transport;
};

const initialContext: InitialConext = {
  song: nelly,
  volume: -32,
  mode: "off",
  player: new Player().toDestination(),
  t: Transport,
};

export const playerMachine = createMachine(
  {
    id: "player",
    context: initialContext,
    initial: "idle",
    states: {
      idle: {
        entry: {
          type: "initializePlayer",
        },
        invoke: {
          src: "loaderActor",
          id: "getting.ready",
          onDone: [
            {
              target: "ready",
            },
          ],
          onError: [
            {
              target: "idle",
            },
          ],
        },
      },
      ready: {
        states: {
          automationMode: {
            initial: "off",
            states: {
              off: {
                on: {
                  write: {
                    target: "writing",
                  },
                  read: {
                    target: "reading",
                  },
                },
              },
              writing: {
                on: {
                  "turn.off": {
                    target: "off",
                  },
                  read: {
                    target: "reading",
                  },
                },
              },
              reading: {
                on: {
                  "turn.off": {
                    target: "off",
                  },
                  write: {
                    target: "writing",
                  },
                },
              },
            },
          },
          playbackMode: {
            initial: "stopped",
            states: {
              stopped: {
                on: {
                  play: {
                    target: "playing",
                  },
                },
              },
              playing: {
                entry: {
                  type: "play",
                },
                invoke: {
                  src: "tickerActor",
                  id: "start.ticker",
                },
                on: {
                  reset: {
                    target: "stopped",
                    actions: {
                      type: "reset",
                    },
                  },
                  pause: {
                    target: "stopped",
                    actions: {
                      type: "pause",
                    },
                  },
                },
              },
            },
            on: {
              fastFwd: {
                guard: "canFF",
                actions: {
                  type: "fastFwd",
                },
              },
              rewind: {
                guard: "canRew",
                actions: {
                  type: "rewind",
                },
              },
              setVolume: {
                actions: {
                  type: "setVolume",
                },
              },
            },
          },
        },
        type: "parallel",
      },
    },
    types: {
      events: {} as
        | { type: "write" }
        | { type: "read" }
        | { type: "play" }
        | { type: "reset" }
        | { type: "pause" }
        | { type: "fastFwd" }
        | { type: "rewind" }
        | { type: "setVolume" }
        | { type: "turn.off" },
    },
  },
  {
    actions: {
      initializePlayer: ({ context: { song } }) => {
        return {
          player: new Player(song.url)
            .sync()
            .start(0, song.start)
            .toDestination(),
        };
      },
      play: assign(({ context: { t } }) => {
        if (audio.state === "suspended") {
          initializeAudio();
          t.start();
        } else {
          t.start();
        }
      }),
      pause: assign(({ context: { t } }) => {
        t.pause();
      }),
      reset: assign(({ context: { t } }) => {
        t.stop();
        t.seconds = 0;
      }),
      fastFwd: assign(({ context: { t } }) => {
        t.seconds = t.seconds + 10;
      }),
      rewind: assign(({ context: { t } }) => {
        t.seconds = t.seconds - 10;
      }),
      setVolume: assign(({ event }) => {
        if (event.type !== "setVolume") throw new Error();
        const scaled = dbToPercent(log(event.volume));
        Destination.volume.value = scaled;
        return {
          volume: event.volume,
        };
      }),
    },
    actors: {
      loaderActor: fromPromise(async () => {
        await loaded();
      }),
      tickerActor: createMachine({
        /* ... */
      }),
    },
    guards: {
      canFF: ({ context: { song, t } }) => {
        return t.seconds < song.end;
      },
      canRew: ({ context: { song, t } }) => {
        return t.seconds > song.start;
      },
    },
    delays: {},
  }
);
export const PlayerContext = createActorContext(playerMachine);
