import { assign, createMachine } from "xstate";
import { nelly } from "./assets/nelly";

export const machine = createMachine(
  {
    id: "mixer",
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
          PLAY: {
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
        target: "#mixer",
        actions: {
          type: "rewind",
        },
      },
      FF: {
        target: "#mixer",
        actions: {
          type: "fastForward",
        },
      },
      SET_VOLUME: {
        target: "#mixer",
        actions: {
          type: "setVolume",
        },
      },
    },
    types: {
      events: {} as
        | { type: "FF" }
        | { type: "PLAY" }
        | { type: "PAUSE" }
        | { type: "RESET" }
        | { type: "loaded" }
        | { type: "REWIND" }
        | { type: "SET_VOLUME" },
    },
  },
  {
    actions: {
      play: ({ context, event }) => {},
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
