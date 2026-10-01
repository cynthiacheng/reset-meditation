import cardImagesData from "@/data/cards-image.json";
import cardWordsData from "@/data/cards-word.json";
import guidingQuestionsData from "@/data/guiding-questions.json";
import type { CardImage, CardWord, GuidingQuestion, GuidingQuestionCategory } from "@/types";

const imageCards = cardImagesData as CardImage[];
const wordCards = cardWordsData as CardWord[];
const guidingQuestions = guidingQuestionsData as GuidingQuestion[];

const GRADIENTS: [string, string][] = [
  ["#d9dcc4", "#3f5c3f"],
  ["#e6ddc4", "#7a5a34"],
  ["#cdd6bd", "#4f6b4a"],
  ["#e3e6d6", "#6b7f5f"],
  ["#ded4b8", "#6e5940"],
  ["#c7d3bb", "#2f4a35"],
  ["#efe6c7", "#a67c3f"],
  ["#d6ddd0", "#3d5c4f"],
  ["#e0ddc6", "#5c6b48"],
  ["#d8cfb8", "#5a4530"],
  ["#c9d6c1", "#2a3f30"],
  ["#e8e2c4", "#8a6a3a"],
];

export function getImageCards(): CardImage[] {
  return imageCards;
}

export function getWordCards(): CardWord[] {
  return wordCards;
}

export function getImageCard(id: string): CardImage | undefined {
  return imageCards.find((card) => card.id === id);
}

export function getWordCard(id: string): CardWord | undefined {
  return wordCards.find((card) => card.id === id);
}

export function getQuestion(id: string): GuidingQuestion | undefined {
  return guidingQuestions.find((question) => question.id === id);
}

export function getCardGradient(id: string): [string, string] {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return GRADIENTS[hash % GRADIENTS.length];
}

function pickRandom<T>(items: T[], excludeId: string | undefined, getId: (item: T) => string): T {
  const pool = excludeId ? items.filter((item) => getId(item) !== excludeId) : items;
  const source = pool.length > 0 ? pool : items;
  return source[Math.floor(Math.random() * source.length)];
}

export function drawCards(previous?: { imageCardId: string; wordCardId: string }): {
  imageCard: CardImage;
  wordCard: CardWord;
} {
  const imageCard = pickRandom(imageCards, previous?.imageCardId, (card) => card.id);
  const wordCard = pickRandom(wordCards, previous?.wordCardId, (card) => card.id);
  return { imageCard, wordCard };
}

function pickQuestionFromCategory(
  category: GuidingQuestionCategory,
  excludeIds: string[]
): GuidingQuestion {
  const pool = guidingQuestions.filter((question) => question.category === category);
  const available = pool.filter((question) => !excludeIds.includes(question.id));
  const source = available.length > 0 ? available : pool;
  return source[Math.floor(Math.random() * source.length)];
}

/**
 * Always grounds the draw in one observation + one action question, with the
 * middle slot alternating between feeling/connection so repeat draws vary.
 */
export function drawGuidingQuestions(recentIds: string[] = []): GuidingQuestion[] {
  const observation = pickQuestionFromCategory("observation", recentIds);
  const middleCategory: GuidingQuestionCategory = Math.random() < 0.5 ? "feeling" : "connection";
  const middle = pickQuestionFromCategory(middleCategory, recentIds);
  const action = pickQuestionFromCategory("action", recentIds);
  return [observation, middle, action];
}
