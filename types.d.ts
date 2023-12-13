import type {
  FeedbackDelay,
  PitchShift,
  Reverb,
  Volume,
  Channel as ToneChannel,
} from "tone";
import type { Destination as ToneDestination } from "tone/build/esm/core/context/Destination";

declare global {
  type Destination = ToneDestination;
  type Channel = ToneChannel;

  type SourceSong = {
    id: string;
    slug: string;
    title: string;
    artist: string;
    year: string;
    studio: string;
    location: string;
    bpm: number;
    start: number;
    end: number;
    tracks?: SourceTrack[];
  };

  type SourceTrack = {
    id: string;
    name: string;
    path: string;
  };
}
