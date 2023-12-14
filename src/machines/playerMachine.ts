import { createActorContext } from "@xstate/react";
import { assign, createMachine, fromObservable, fromPromise } from "xstate";
import { dbToPercent, formatMilliseconds, log } from "@/utils";
import { nelly } from "@/assets/nelly";
import {
  start as initializeAudio,
  getContext as getAudioContext,
  Transport,
  Destination,
  Player,
  Meter,
  loaded,
} from "tone";
import { interval, animationFrameScheduler } from "rxjs";

const audio = getAudioContext();

type InitialConext = {
  song: SourceSong;
  player: Player | undefined;
  meter: Meter | undefined;
  t: Transport;
  currentTime: string;
  volume: number;
  meterVal: number | number[] | undefined;
};

const initialContext: InitialConext = {
  song: nelly,
  player: new Player().toDestination(),
  meter: new Meter(),
  t: Transport,
  currentTime: "00:00:00",
  volume: -32,
  meterVal: 0,
};

export const playerMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAcA2BDAnmATgOgEsJUwBiCAewDsxCqA3Cga1pgBc2Cqo8cx0ImANoAGALqIUFWAU7VJIAB6IArACYANCEyIAjCJUAOPADZ1htSN0AWNWYDM1gL5OtaLLkLEyuHBXzubABm-gC2eOyc3Lz8gqISSCDI0rIE8onKCLr29nj2JgDsugWG9gCc1ur2aipaOgiGunjqIlYiZSYV9gUqZS5uGNj4fAKYeOgArmwUoehyVACyFBC0FEFBpADuOLJg8QrJMvMKmda6aqbt5SIl+YYilXWIBQXWeGoFrSKdD2pq1s5XElBp4RoJxlMZnM0otlqt1qQwftEodUulQKdzpcytdbiZ7o9tIgTAZmpZWtYygZ7IZrPZ+sCPMNYmNJtNZvMlis8NtUtxSGsgsipEcYSdELYmip7OcVLpOqVdLTrE8EAU1LkXl8VCoiiYTHSGe4hjFRhD2dDqFzaLyolBEbFhUkUscMsS-nh9DjDGYVLYcfZVS8THgta0frZ-oCBkzTeC2VDOXC41x7YKnajXRjiTK8CIZf9XvicdlVYYyio8+SbrqDA96UDjaCWebEzDrSn+ba9uIDi6xW6ECYPV6ab7-Tkg3Z3p9Wjq9QaGzGTWCxsaAEboADGTGtpCC6FgbAAYpsIBn++ilKpsngymU1MUXtl7vnVbon3hbMPeh1DOWbCNEFmTNDdt13OEHU2Lhz17FFLyocUEDlYxaxlElaRJA13xERovwKGVHDpXoXgKIDY1XPAwJ3PdYDANgADUKFQCZQh7BIRTRRDBxUB5QyVAoTGyXCzFwgpVTKQxKxaVpy3zb4znIlcW2oiDuSPChkGQSBSGNC9RSvTJeJEO9ujlbIOkE-F33KN5DAKb17OKaoHyU5tQMGTcaOTY1UwdOi2H0rikOsCxmhKF8AUaWSVSJLI-SaHIal0HULHuJdGWUjysC8tTaF8-lkEmOigqza8EFCi5dUaGkov0XDYvqGxKjyBzrgeSTywbIEqDheAUWAvsDO47MEAAWl0VUxsrMoHM6n9ZJpPpG2ArwSCG4LB2scS4uyN4RGrISzkcdK3JAwQNrKzJLAKbF8h1DUbjS1U6RMuV7wsDpRLKbIzrjVlIQ5ds4UugdRpqSsSRxX1HpKNRDFVFC810D6aihnVdD+yiEyBq1k0FUHDMQex8zumGSduVUhLKcKvhrOV5yxlscctWFuVtVNCZG8q5Sq6x8TmopnM0OKCIuexpRyFK6UEnImbNFmk25MFOfg4akLFvN+fs3UzhKEwpxp4dWhsAkfvyeXwVU60uaQuwTKh+6qiewNdvt1qcQcxpXtclaKJUzzwI7DStMgW2eIqT0de+FprCsV2mu2pp9F6EwJZqAxBMttdA+87kCqgcPRpJ4xHfJl33yRuk4-s17ywNFwXCAA */
    id: "player",
    context: initialContext,
    initial: "idle",
    states: {
      idle: {
        entry: {
          type: "initPlayer",
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
                  write: "writing",
                  read: "reading",
                },
              },
              writing: {
                on: {
                  off: "off",
                  read: "reading",
                },
              },
              reading: {
                on: {
                  off: "off",
                  write: "writing",
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
                  context.meter && Destination.connect(context.meter);
                  context.currentTime = formatMilliseconds(context.t.seconds);
                  context.meterVal = context.meter?.getValue();
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
              setMeter: {
                actions: {
                  type: "setMeter",
                },
              },
            },
          },
        },
        type: "parallel",
      },
    },
    types: {} as {
      context: InitialConext;
      events:
        | { type: "write" }
        | { type: "read" }
        | { type: "off" }
        | { type: "play"; t: Transport }
        | { type: "reset" }
        | { type: "pause" }
        | { type: "fastFwd" }
        | { type: "rewind" }
        | { type: "setVolume"; volume: number }
        | { type: "setMeter"; meterVal: number };
      guards: { type: "canFF" } | { type: "canRew" };
    },
  },
  {
    actions: {
      initPlayer: ({ context: { song } }) => {
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
          return t.start();
        } else {
          return t.start();
        }
      }),
      pause: assign(({ context: { t } }) => {
        return t.pause();
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
      setMeter: assign(({ context, event }) => {
        if (event.type !== "setMeter") throw new Error();
        context.meterVal = event.meterVal;
        return {
          meterVal: context.meterVal,
        };
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
      loaderActor: fromPromise(async () => await loaded()),
      tickerActor: fromObservable(() => interval(0, animationFrameScheduler)),
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
