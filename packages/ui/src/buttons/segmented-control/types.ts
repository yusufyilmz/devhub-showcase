export type SegmentedControlOptions = {
  buttons: { value: string; label: string }[];
  selected?: string;
  defaultSelected?: string;
  onToggle: (value: string) => void;
};
