import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "離線中｜Reset",
};

export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center px-6 pb-8 pt-16 text-center">
      <div className="rounded-2xl bg-cream/85 px-5 py-4 shadow-sm backdrop-blur-sm dark:bg-ink/70">
        <h1 className="font-heading text-xl text-ink dark:text-cream">目前處於離線狀態</h1>
        <p className="mt-2 text-sm text-ink/70 dark:text-cream/70">
          連上網路後，就可以繼續使用冥想、內在對話與牌卡功能。已儲存的本地紀錄不會受影響。
        </p>
      </div>
    </div>
  );
}
