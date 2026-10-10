# Reset｜靜心・書寫・指引

為忙碌的上班族設計的 mobile-first PWA，提供三個核心功能：

- 🧘 **主題式冥想**：以有趣的主題（一聽就睡、開會前三分鐘…）分類 YouTube 冥想影片
- ✍️ **內在對話**：「自由傾訴」用語音或打字把想法倒出來，可存成紀錄、匯出，或請 AI 拆解成待辦清單；「感恩日記」隨口記下每天感恩的 3 件事
- 🃏 **牌卡指引**：原創圖像卡＋詞彙卡的投射式牌卡練習，附引導問題與分享圖產生

一般使用者需要輸入已核准的 email 才能登入（直接比對後台名單，無密碼、無寄信），個人資料（收藏、紀錄、待辦、抽卡）則都存在裝置本地的 IndexedDB，不會上傳。冥想主題／影片內容與使用者名單由管理員透過後台（`/admin`）集中管理，存在共用的 Postgres 資料庫。

## 技術棧

- **框架**：Next.js 16（App Router）+ TypeScript + Tailwind CSS v4
- **本地儲存**：Dexie.js 包裝 IndexedDB，透過 repository pattern 抽象（`lib/repositories/`），未來要換成雲端同步只需替換實作
- **後台資料庫**：Prisma 7 + Postgres（建議 Vercel Postgres），管理使用者名單與冥想主題／影片內容，`lib/prisma.ts`
- **後台登入**：單一管理員密碼（env var）+ 簽章 JWT cookie，`proxy.ts` 保護 `/admin/**`
- **使用者登入**：輸入 email 直接比對後台名單，`active` 就立刻登入，否則顯示聯絡窗口；無密碼、無寄信；`proxy.ts` 同時保護整個前台（`/login` 本身除外）
- **錄音檔上傳**：Vercel Blob，瀏覽器端直傳（`@vercel/blob/client`），避免大檔案卡在 serverless request 限制
- **AI**：Anthropic Claude API，僅在伺服器端的 Route Handler（`app/api/brain-dump/todo/route.ts`）呼叫，API key 不會出現在前端
- **語音輸入**：瀏覽器原生 Web Speech API（`zh-TW`），不支援的瀏覽器會自動隱藏麥克風按鈕
- **PWA**：Serwist（`serwist` + `@serwist/turbopack`），支援離線 fallback 頁與資源預快取
- **i18n**：文案集中於 `lib/i18n/strings.ts`，目前僅繁體中文，但結構已為多語系預留

## 本地開發

需要 Node.js 20 以上。

```bash
npm install
npm run dev
```

開啟 [http://localhost:3000](http://localhost:3000)。

若要測試正式建置（含 PWA / Service Worker 的實際行為，開發模式下的快取行為與正式環境不完全相同）：

```bash
npm run build
npm start
```

## 設定 Claude API Key

Brain dump 的「整理成待辦」功能需要呼叫 Anthropic Claude API。

1. 複製 `.env.local.example` 為 `.env.local`
2. 到 [Anthropic Console](https://console.anthropic.com/) 申請 API key，填入：

   ```
   ANTHROPIC_API_KEY=sk-ant-xxxxxxxx
   ```

3.（可選）`ANTHROPIC_MODEL` 預設為 `claude-haiku-4-5-20251001`，可依需求改成其他 Claude 模型

沒有設定 API key 時，其餘功能（冥想、純記錄、匯出、牌卡、成長歷程）都能正常使用；只有「整理成待辦」會顯示「整理失敗了，原文已經幫你存好，要不要再試一次？」，原始文字不會遺失，之後補上 API key 並按「重試」即可。

## 設定後台（資料庫、Blob 儲存、管理員登入）

冥想主題／影片與使用者名單現在存在 Postgres，透過 `/admin` 後台管理，不用改程式碼或重新部署。

1. 到 [Vercel](https://vercel.com/) 專案的 Storage 分頁，透過 Marketplace 建立一個 **Neon**（Postgres）資料庫（Vercel 已不提供自家的「Vercel Postgres」，改由 Neon／Supabase 等合作廠商提供，Neon 是直接的後繼者）。進到該資料庫的 Neon 主控台按 **Connect** 拿到連線字串，填入 `.env.local` 的 `DATABASE_URL`
2. 同樣在 Storage 分頁建立一個 **Blob** store，把 token 填入 `BLOB_READ_WRITE_TOKEN`（管理員上傳錄音檔時會用到）
3. 設定 `ADMIN_PASSWORD`（自己選一個高強度密碼）與 `ADMIN_SESSION_SECRET`（隨機字串，例如 `openssl rand -base64 32`）
4. 建立資料表並匯入既有的 8 個冥想主題：

   ```bash
   npx prisma db push        # 依 prisma/schema.prisma 建立資料表
   npx prisma db seed        # 從 data/meditations.json 匯入主題（不含影片，影片之後在後台加）
   ```

5. 啟動後到 [http://localhost:3000/admin/login](http://localhost:3000/admin/login) 用剛剛設的密碼登入

登入後台可以：

- **使用者管理**（`/admin/users`）：貼上多筆 email 批量導入、啟用/停用、刪除。**`active` 狀態會直接影響該信箱能不能登入前台**（見下一節）
- **冥想內容管理**（`/admin/meditations`）：新增/刪除主題；每個主題底下可加入 YouTube 網址（貼完整網址或純 ID 都可以）或直接上傳錄音檔（會顯示原生播放器，而非 YouTube 嵌入）

`data/meditations.json` 現在只是「初始種子資料」，`prisma db seed` 之後就不會再被讀取，之後新增/修改主題一律透過後台。

牌卡資料（下一節）目前還是靜態 JSON，不在後台管理範圍內。

## 設定使用者登入（直接比對名單）

一般使用者（前台 `/meditations`、`/inner-dialogue`、`/cards`、`/journal`）現在需要登入才能使用，流程不寄送任何郵件：

1. 使用者在 `/login` 輸入 email
2. 如果這個 email 在後台名單中且是 `active`，立即登入並導向 `/meditations`
3. 如果 email 不在名單中或已被停用，畫面上顯示「這個信箱還沒有開通，請寫信給 cynthia.jeng@gmail.com 洽詢。」，不會登入

**注意**：這不是真正的身份驗證——只要知道或猜到一個已核准的 email，任何人都能用它登入，系統不會驗證輸入者是否真的擁有這個信箱。這是配合「先做管理名單、不做密碼」的簡化需求的明確取捨；如果之後需要防止冒用，可以改成寄送一次性連結或驗證碼的方式。

設定步驟：

1. 設定 `USER_SESSION_SECRET`（隨機字串，**不要**跟 `ADMIN_SESSION_SECRET` 共用，例如 `openssl rand -base64 32`）
2. 到 `/admin/users` 把要開放的 email 加進名單（預設就是 `active`）

## 編輯牌卡資料

三個資料檔都在 `data/`：

- `cards-image.json`：44 張圖像卡，目前 `imageUrl` 都是空字串，會自動顯示柔和漸層佔位圖（依 `id` 決定配色，同一張卡每次顯示的顏色一致）。之後有正式插畫時，把圖片放進 `public/`，並填入對應的 `imageUrl`（例如 `/cards/img-01.png`）即可自動換成真實圖片
- `cards-word.json`：44 個原創詞彙卡，可直接修改 `text` 欄位
- `guiding-questions.json`：36 題引導問題，分 `observation`（觀察）／`feeling`（感受）／`connection`（連結）／`action`（行動）四類。抽卡時固定抽 1 題觀察 + 1 題（感受或連結隨機）+ 1 題行動，可在 `lib/cards.ts` 的 `drawGuidingQuestions` 調整規則

## 專案結構

```
app/            Next.js App Router 頁面與 API route（含 app/admin 後台）
components/     依功能分類的 React 元件
lib/            資料存取（repositories）、AI、語音、分享、i18n 等邏輯
prisma/         資料庫 schema、seed script
data/           牌卡的靜態資料（JSON）；meditations.json 僅作 seed 用
types/          共用 TypeScript 型別
public/         PWA icons、manifest.json
proxy.ts        保護 /admin/** 的登入驗證（Next.js Proxy，取代舊版 middleware）
```

## 部署到 Vercel

1. 將專案推送到 GitHub／GitLab／Bitbucket
2. 到 [Vercel](https://vercel.com/new) 匯入專案
3. 在專案的 Storage 分頁透過 Marketplace 建立 Neon（Postgres）與 Blob（見上方「設定後台」；Vercel 已不提供自家的 Postgres，改由 Neon／Supabase 等合作廠商提供），連上專案後 Vercel 會自動把 `DATABASE_URL`／`BLOB_READ_WRITE_TOKEN` 寫進專案的 Environment Variables
4. 手動補上 `ANTHROPIC_API_KEY`（與可選的 `ANTHROPIC_MODEL`）、`ADMIN_PASSWORD`、`ADMIN_SESSION_SECRET`、`USER_SESSION_SECRET`（見「設定使用者登入」一節）
5. 部署後，用該資料庫連線字串在本機跑一次 `npx prisma db push && npx prisma db seed`（或用 Vercel CLI 的 `vercel env pull` 拉正式環境變數再跑），把資料表與初始主題建到正式資料庫
6. 部署後 Vercel 會自動使用 `npm run build`，PWA 的 service worker 路由（`/serwist/[path]`）會在建置時一併產生，不需要額外設定
