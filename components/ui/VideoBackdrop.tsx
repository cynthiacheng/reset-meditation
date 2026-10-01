export function VideoBackdrop() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-background" aria-hidden="true">
      <video
        className="h-full w-full object-cover"
        src="/videos/forest-loop.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/15 to-background/90 dark:from-black/35 dark:via-background/45 dark:to-background/95" />
    </div>
  );
}
