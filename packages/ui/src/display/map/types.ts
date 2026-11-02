import type { Language } from "@shared/config";

export interface LocationMapProps {
  language?: Language;
  latitude: number;
  longitude: number;
  title: string;
}
