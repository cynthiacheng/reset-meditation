export type MeditationSourceType = "youtube" | "upload";

export interface MeditationVideo {
  id: string;
  sourceType: MeditationSourceType;
  youtubeId: string | null;
  audioUrl: string | null;
  title: string;
  durationMin: number;
}

export interface MeditationTheme {
  themeId: string;
  themeName: string;
  emoji: string;
  description: string;
  videos: MeditationVideo[];
}

export interface CardImage {
  id: string;
  imageUrl: string;
}

export interface CardWord {
  id: string;
  text: string;
}

export type GuidingQuestionCategory = "observation" | "feeling" | "connection" | "action";

export interface GuidingQuestion {
  id: string;
  category: GuidingQuestionCategory;
  text: string;
}
