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
            target: "stopped",
          },
        },
      },
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
      reset: {
        target: ".stopped",
        actions: {
          type: "reset",
        },
      },
      rewind: {
        actions: {
          type: "rewind",
        },
        guard: "canRew",
      },
      fastFwd: {
        actions: {
          type: "fastFwd",
        },
        guard: "canFF",
      },
      setVolume: {
        actions: {
          type: "setVolume",
        },
      },
    },
    types: {
      events: {} as
        | { type: "play" }
        | { type: "pause" }
        | { type: "reset" }
        | { type: "loaded" }
        | { type: "fastFwd" }
        | { type: "rewind" }
        | { type: "setVolume"; volume: number },
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
