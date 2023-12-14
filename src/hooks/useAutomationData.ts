import { PlayerContext } from "@/machines/playerMachine";
import { useEffect, useCallback } from "react";
import { localStorageGet, localStorageSet, roundFourth } from "@/utils";

type Props = { value: number };

function useAutomationData() {
  const state = PlayerContext.useSelector((state) => {
    return state;
  });
  console.log("state", state.value.ready.automationMode);
  const volume: number = state.context.volume;
  // useWrite({ value: volume });
  // useRead();
  return null;
}

const data = new Map<number, object>();

// !!! --- WRITE --- !!! //
function useWrite({ value }: Props) {
  const state = PlayerContext.useSelector((state) => state);

  return null;

  useEffect(() => {
    if (playbackMode !== "write") return;

    const loop = t.scheduleRepeat(
      () => {
        const time: number = roundFourth(t.seconds);
        data.set(time, { id, time, value });
        const mapToObject = (map) => Object.fromEntries(map.entries());
        const newData = mapToObject(data);
        localStorageSet("volumeData", newData);
      },
      0.25,
      0
    );

    return () => {
      t.clear(loop);
    };
  }, [id, value, playbackMode]);

  return data;
}

// !!! --- READ --- !!! //
function useRead() {
  const { send } = PlayerContext.useActorRef();
  const playbackMode = PlayerContext.useSelector(
    (state) => state.context.currentTracks[trackId].volumeMode
  );

  const setParam = useCallback(
    (
      trackId: number,
      data: {
        time: number;
        value: number;
      }
    ) => {
      t.schedule(() => {
        if (playbackMode !== "read") return;

        send({
          type: "SET_TRACK_VOLUME",
          trackId,
          channels,
          value: data.value,
        });
      }, data.time);
    },
    [playbackMode, channels, send]
  );

  const volumeData = localStorageGet("volumeData");

  useEffect(() => {
    if (playbackMode !== "read" || !volumeData) return;
    const objectToMap = (obj) => new Map(Object.entries(obj));
    const newVolData = objectToMap(volumeData);
    for (const value of newVolData) {
      setParam(value[1].id, value[1]);
    }
  }, [volumeData, setParam, playbackMode]);

  return null;
}
export default useAutomationData;
