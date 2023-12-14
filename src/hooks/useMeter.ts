import { useEffect, useCallback, useRef, useState } from "react";
import { Meter } from "tone";
import { type Destination } from "tone/build/esm/core/context/Destination";

export default function useMeter(channel: Destination) {
  const [meterVals, setMeterVals] = useState(() => 0);
  const meter = useRef<Meter | undefined>();
  const animation = useRef<number | null>(null);

  // loop recursively to amimateMeters
  const animateMeter = useCallback(() => {
    const val = meter.current?.getValue();
    if (typeof val === "number") {
      setMeterVals(val);
    }
    animation.current = requestAnimationFrame(animateMeter);
  }, []);

  // create meter and trigger animateMeter
  useEffect(() => {
    meter.current = new Meter();
    channel.connect(meter.current);
    requestAnimationFrame(animateMeter);
    return () => {
      animation.current && cancelAnimationFrame(animation.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return meterVals;
}
