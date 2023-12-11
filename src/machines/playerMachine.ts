import { createActorContext } from "@xstate/react";
import { assign, createMachine } from "xstate";
import { dbToPercent, log } from "@/utils";
import { nelly } from "@/assets/nelly";
import {
  start as initializeAudio,
  getContext as getAudioContext,
  Transport as t,
  Destination,
} from "tone";

const audio = getAudioContext();

const initialContext = {
  song: nelly,
  volume: -32,
  mode: "static",
};

export const playerMachine = createMachine(
  {
    id: "player",
    context: initialContext,
    initial: "loading",
    states: {
      loading: {
        on: {
          loaded: {
            target: "loaded",
          },
        },
      },
      loaded: {
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
                  disable: {
                    target: "off",
                  },
                  read: {
                    target: "reading",
                  },
                },
              },
              reading: {
                on: {
                  disable: {
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
      play: () => {
        if (audio.state === "suspended") {
          initializeAudio();
          t.start();
        } else {
          t.start();
        }
      },
      pause: () => t.pause(),
      reset: () => {
        t.stop();
        t.seconds = 0;
      },
      fastFwd: () => {
        t.seconds = t.seconds + 10;
      },
      rewind: () => {
        t.seconds = t.seconds - 10;
      },
      setVolume: assign(({ event }) => {
        if (event.type !== "setVolume") throw new Error();
        const scaled = dbToPercent(log(event.volume));
        Destination.volume.value = scaled;
        return {
          volume: event.volume,
        };
      }),
    },
    actors: {},
    guards: {
      canFF: ({ context }) => {
        return t.seconds < context.song.end;
      },
      canRew: ({ context }) => {
        return t.seconds > context.song.start + 10;
      },
    },
    delays: {},
  }
);
export const PlayerContext = createActorContext(playerMachine);
