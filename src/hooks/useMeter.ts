import { useEffect, useRef, useState } from "react";
import { Meter, Destination } from "tone";

export default function useMeter() {
  const [meterVal, setMeterVals] = useState(() => 0);
  const meter = useRef<Meter | undefined>();
  const animation = useRef<number | null>(null);

  useEffect(() => {
    // loop recursively to amimateMeters
    const animateMeter = () => {
      const val = meter.current?.getValue();
      if (typeof val !== "number") return;
      setMeterVals(val);
      animation.current = requestAnimationFrame(animateMeter);
    };

    // create meter and trigger animateMeter
    meter.current = new Meter();
    Destination.connect(meter.current);
    requestAnimationFrame(animateMeter);
    return () => {
      animation.current && cancelAnimationFrame(animation.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return meterVal;
}
