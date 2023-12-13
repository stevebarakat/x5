import { createActorContext } from "@xstate/react";
import { assign, createMachine, fromObservable, fromPromise } from "xstate";
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
import { interval } from "rxjs";

const audio = getAudioContext();

type InitialConext = {
  song: Song;
  volume: number;
  mode: "off" | "read" | "write";
  player: Player | undefined;
  t: typeof Transport;
  clock: number;
};

const initialContext: InitialConext = {
  song: nelly,
  volume: -32,
  mode: "off",
  player: new Player().toDestination(),
  t: Transport,
  clock: 0,
};

export const playerMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAcA2BDAnmATgOgEsJUwBiCAewDsxCqA3Cga1pgBc2Cqo8cx0ImANoAGALqIUFWAU7VJIAB6IArACYANCEyIAjCJUAOPADZ1hgCxrDATjUmAzCYDsAX1da0WXIWJlcOBT4XmwAZkEAtnjsnNy8-IKiEkggyNKyBPIpygi6Dg54Ts66zoYONhbqDmoqWjoIhrp46iIi+jYmFQ7OKjbunhjY+HwCmHjoAK5sFBHoclQAshQQtBShoaQA7jiyYEkKaTLzCjkWumqmIjblIqVOhiKVdYjOzhZ4as6tah0qVrcqfqpQY+EaCcZTGZzTKLZardakMH7FKHDJZUCnc6Xa42W5lEwPJ7aRAmAzNNTfZxmFRFExArxDeKjCHTWbzJYrPDbDLcUhsCY4Kh4NahZFSI4wk6IM4XUk4vH3R61YkIZxqAqvb5lNS6EwWKn0kHDBJjSas6HUDm0bmxKCIhJi1LpY7ZEnlPC2ESOTo-AkiBzPVVUvCakS+v4UnqG7zG5lmqHsuFMiBcO38wXC9aO1EujFumwe3HeuwdB4BlW2FR4MOtBz+ikWQxRjzAmPJ02Qtkwq3J1NbHZsPbiA7OyWuhBmZymYqGJt1lRenqBtUmD5fMPa3X6ukthmgk14BkAI3QAGMmFbSKF0LA2AAxTYQbOj9FKVQOJqvBxWB62XRNixA10EopysExrE+f8AMBXcjXbQ9BhPc9Lz4TYuCfYcURfKgpQQGlVwcFRdBUEw9V6GxrkAlV9EaPB9Q-FQZ16OVo0ZMExmPM8LzhUhYDANgADUKFQCYIiHZJxTRHDx3UC4LAomxZ0ogx9UDRSqxaf1dRpR5mwGNt2IQrAkO4zlbwoZBkEgUgGWfCVXxyBcRDwa4emA8oXFIwwgPKd4mwqYCLBcD81AsVj92ZTjkKTBk+z4Pi2DsqTcMbC5GMaBxLEbfQREsIC-iafIakyorSh3fS2IPKLTNoWLeWQSY+KS3M3wQVLmlKPIssaVo8uoixKkKZwAs+Cim1C9wWyoOF4BRI0R3s6S8wQABaXRAxWqtFNaHbdp2sLYLbIgSAW5Lx1U6jv2rClWhMXQzm-MtwtjQRTpanJI2xM59HVR4LvqCw63JVoSiue7LF0Z74PjLtLThN6x2Wmoqzlb6wzrAbnEDIjjBrDcvSuHVytbSq407C1YU5EUEYcxA6wKVHgPRv6sZVO6C0YrUDCIwjib3F6O3NRNORtVMaaW1qdMKaw8n9IKSLDZdqkKGknH-TU3jUKHDJhimezBMWsMW3CqSnOVuj1OwFc0FU1QLcDax6P5bAJbWqsQrirXF3D7Gcxmfox-69F9oaKlymoSlnLXDtJ8Fqp7czLMgb2ZIqPB1YXMwGzact6nu4p04MGw3lxVp5OjiqIrjj3os5OqoBT5a62Mf3mcx-L-zo78mf-XLhpg9wgA */
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
            invoke: {
              src: "tickerActor",
              id: "start.ticker",
              onSnapshot: {
                actions: assign(({ context }) => {
                  console.log("context.t.seconds", context.t.seconds);
                  console.log("context.clock", context.clock);
                  return context.t.seconds;
                }),
              },
            },
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
        | { type: "setVolume"; volume: number }
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
      tickerActor: fromObservable(() => interval(10)),
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
