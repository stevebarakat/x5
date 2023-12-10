import { createActorContext } from "@xstate/react";
import { assign, createMachine } from "xstate";
import { produce } from "immer";
import {
  start as initializeAudio,
  getContext as getAudioContext,
  Transport as t,
} from "tone";

const audioContext = getAudioContext();

const initialContext = {
  song: {
    url: "/nelly.mp3",
    start: 3,
    end: 244,
  },
  volume: 20,
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
        target: "#player",
        actions: {
          type: "rewind",
        },
      },
      fastFwd: {
        target: "#player",
        actions: {
          type: "fastFwd",
        },
      },
      setVolume: {
        target: "#player",
        actions: {
          type: "setVolume",
        },
      },
    },
    types: {
      events: {} as
        | { type: "fastFwd" }
        | { type: "play" }
        | { type: "pause" }
        | { type: "reset" }
        | { type: "loaded" }
        | { type: "rewind" }
        | { type: "setVolume"; volume: number },
    },
  },
  {
    actions: {
      play: ({ context }) => {
        if (audioContext.state === "suspended") {
          initializeAudio();
          t.seconds = context.song.start;
          t.start();
        } else {
          t.seconds = context.song.start;
          t.start();
        }
      },
      pause: () => t.pause(),
      reset: () => {
        t.stop();
        t.seconds = 0;
      },
      fastFwd: ({ context }) => {
        t.seconds =
          t.seconds > 10 - context.song.end
            ? t.seconds + 10
            : (t.seconds = context.song.end);
      },
      rewind: ({ context }) =>
        (t.seconds =
          t.seconds > 10 + context.song.start
            ? t.seconds - 10
            : context.song.start),
      setVolume: assign(({ event }) => {
        if (event.type !== "setVolume") throw new Error();
        return {
          volume: event.volume,
        };
      }),
    },
    actors: {},
    guards: {},
    delays: {},
  }
);
export const PlayerMachineContext = createActorContext(playerMachine);
