/** Simplified, generic glyphs evoking each platform — not the official trademarked logo assets. */

export function InstagramIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
    </svg>
  );
}

export function FacebookIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M13.8 8.4h1.4V6h-1.8c-1.6 0-2.7 1.1-2.7 2.8v1.4H9.2v2.4h1.5V18h2.4v-5.4h1.6l.3-2.4h-1.9v-1.1c0-.5.2-.7.7-.7Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function LineIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 3.5c-5 0-9 3.2-9 7.2 0 3.6 3.2 6.6 7.5 7.1.3 0 .6.2.5.6l-.3 1.9c-.1.3.1.6.5.5 2.2-1 7.6-4.3 9.3-7.4.7-1 1-2.1 1-3.2 0-4-4-7.7-9.5-7.7Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
