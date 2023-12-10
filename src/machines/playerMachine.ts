import { createActorContext } from "@xstate/react";
import { assign, createMachine } from "xstate";
import { dbToPercent, log } from "@/utils";
import {
  start as initializeAudio,
  getContext as getAudioContext,
  Transport as t,
  Destination,
} from "tone";

const audioContext = getAudioContext();

const initialContext = {
  song: {
    url: "/nelly.mp3",
    start: 3,
    end: 15,
  },
  volume: -32,
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
            guard: "canPlay",
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
      },
      fastFwd: {
        actions: {
          type: "fastFwd",
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
        const scaled = dbToPercent(log(event.volume));
        Destination.volume.value = scaled;
        return {
          volume: event.volume,
        };
      }),
    },
    actors: {},
    guards: {
      canPlay: ({ context }) => {
        console.log(t.seconds < context.song.end);
        console.log("context.song.end", context.song.end);
        console.log("t.seconds", t.seconds);
        return t.seconds < context.song.end;
      },
    },
    delays: {},
  }
);
export const PlayerMachineContext = createActorContext(playerMachine);
