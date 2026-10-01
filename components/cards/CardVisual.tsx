import { getCardGradient } from "@/lib/cards";
import type { CardImage } from "@/types";

export function CardVisual({ card, className = "" }: { card: CardImage; className?: string }) {
  if (card.imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- placeholder will be user-supplied static art
      <img src={card.imageUrl} alt="" className={`h-full w-full object-cover ${className}`} />
    );
  }

  const [from, to] = getCardGradient(card.id);

  return (
    <div
      className={`flex h-full w-full items-center justify-center ${className}`}
      style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
    >
      <svg viewBox="0 0 100 100" className="h-1/3 w-1/3 opacity-70" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="30" stroke="white" strokeWidth="2" fill="none" opacity="0.6" />
        <circle cx="50" cy="50" r="17" stroke="white" strokeWidth="1.5" fill="none" opacity="0.5" />
      </svg>
    </div>
  );
}
