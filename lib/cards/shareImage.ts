import { getCardGradient } from "@/lib/cards";
import type { CardImage, CardWord } from "@/types";

const WIDTH = 1080;
const HEIGHT = 1350;

export async function generateShareImageBlob(
  imageCard: CardImage,
  wordCard: CardWord
): Promise<Blob | null> {
  if (typeof document === "undefined") return null;

  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const [from, to] = getCardGradient(imageCard.id);
  const gradient = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
  gradient.addColorStop(0, from);
  gradient.addColorStop(1, to);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.strokeStyle = "rgba(255,255,255,0.55)";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(WIDTH / 2, HEIGHT / 2 - 60, 220, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(WIDTH / 2, HEIGHT / 2 - 60, 130, 0, Math.PI * 2);
  ctx.stroke();

  if (document.fonts?.ready) {
    try {
      await document.fonts.ready;
    } catch {
      // Fall back to default font metrics if font loading state can't be read.
    }
  }

  ctx.fillStyle = "rgba(58, 58, 56, 0.9)";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = '700 96px "Noto Serif TC", serif';
  ctx.fillText(wordCard.text, WIDTH / 2, HEIGHT / 2 - 60);

  ctx.font = '400 32px "Noto Sans TC", sans-serif';
  ctx.fillStyle = "rgba(58, 58, 56, 0.75)";
  ctx.fillText("Reset · 牌卡指引", WIDTH / 2, HEIGHT - 120);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/png", 0.95);
  });
}
