/**
 * Facebook's Share Dialog and LINE's share-it plugin both work by sharing a
 * URL (plus optional text) that opens the platform's own compose window — no
 * login or account connection needed. Neither accepts an attached image file
 * directly; a locally generated canvas image has to be shared separately
 * (via the Web Share API on mobile, or a manual download) if the user wants
 * it attached to their post.
 */

export function getFacebookShareUrl(url: string, quote: string): string {
  const params = new URLSearchParams({ u: url, quote });
  return `https://www.facebook.com/sharer/sharer.php?${params.toString()}`;
}

export function getLineShareUrl(url: string, text: string): string {
  const params = new URLSearchParams({ url, text });
  return `https://social-plugins.line.me/lineit/share?${params.toString()}`;
}

export function openShareWindow(url: string): void {
  window.open(url, "_blank", "noopener,noreferrer,width=600,height=600");
}
