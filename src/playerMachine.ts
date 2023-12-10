import { assign, createMachine } from "xstate";
import { nelly } from "./assets/nelly";
import {
  start as initializeAudio,
  getContext as getAudioContext,
  Transport as t,
} from "tone";

const audioContext = getAudioContext();

const initialContext = {
  song: {
    url: "/nelly.mp3",
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
          PAUSE: {
            target: "stopped",
            actions: {
              type: "pause",
            },
          },
        },
      },
    },
    on: {
      RESET: {
        target: ".stopped",
        actions: {
          type: "reset",
        },
      },
      REWIND: {
        target: "#player",
        actions: {
          type: "rewind",
        },
      },
      FF: {
        target: "#player",
        actions: {
          type: "fastForward",
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
        | { type: "FF" }
        | { type: "play" }
        | { type: "PAUSE" }
        | { type: "RESET" }
        | { type: "loaded" }
        | { type: "REWIND" }
        | { type: "setVolume"; volume: number },
    },
  },
  {
    actions: {
      play: () => {
        if (audioContext.state === "suspended") {
          initializeAudio();
          t.start();
        } else {
          t.start();
        }
      },
      pause: ({ context, event }) => {},
      reset: ({ context, event }) => {},
      rewind: ({ context, event }) => {},
      fastForward: ({ context, event }) => {},
      setVolume: ({ context, event }) => {},
    },
    actors: {},
    guards: {},
    delays: {},
  }
);
