/** Shapes of the array values in locales/<lang>/official.json. */
export interface StatItem {
  value: string;
  label: string;
}

export interface StepItem {
  title: string;
  body: string;
}

export interface WhyItem {
  heading: string;
  body: string;
}

export interface LabItem {
  title: string;
  body: string;
  /** Short instrument-style label, e.g. "DIAG". */
  tag: string;
}

export interface TimelineItem {
  year: string;
  title: string;
  body: string;
}

export interface DayHours {
  day: string;
  time: string;
}
