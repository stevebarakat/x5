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
          id: "loaded",
          onDone: [
            {
              target: "loaded",
            },
          ],
          onError: [
            {
              target: "idle",
            },
          ],
        },
      },
      loaded: {
        states: {
          automationMode: {
            initial: "disabled",
            states: {
              disabled: {
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
                  disable: {
                    target: "disabled",
                  },
                  read: {
                    target: "reading",
                  },
                },
              },
              reading: {
                on: {
                  disable: {
                    target: "disabled",
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
          },
        },
        type: "parallel",
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
    types: {
      events: {} as
        | { type: "fastFwd" }
        | { type: "rewind" }
        | { type: "setVolume"; volume: number }
        | { type: "read" }
        | { type: "pause" }
        | { type: "reset" }
        | { type: "write" }
        | { type: "disable" }
        | { type: "loaded" }
        | { type: "play" },
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
