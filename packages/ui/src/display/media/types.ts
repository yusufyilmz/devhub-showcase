export type WorkMediaOptions = {
  title: string;
  sourceUrl?: string;
  imageUrl?: string;
  youtubeId?: string;
  loadLabel?: string;
  unloadLabel?: string;
};

export type VideoPlayerOptions = WorkMediaOptions & { video: string };
