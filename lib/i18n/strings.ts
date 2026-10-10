const strings = {
  common: {
    appName: "Reset",
    save: "儲存",
    cancel: "取消",
    delete: "刪除",
    confirm: "確定",
    edit: "編輯",
    loading: "載入中…",
    retry: "重試",
    share: "分享",
    download: "下載",
    copy: "複製",
  },
  nav: {
    meditation: "冥想",
    innerDialogue: "內在對話",
    cards: "潛意識指引",
    journal: "我的紀錄",
  },
  login: {
    title: "歡迎回來",
    description: "輸入你的 email 以繼續。",
    emailPlaceholder: "你的 email",
    submit: "登入",
    sending: "確認中…",
    invalidEmail: "請輸入有效的 email。",
    genericError: "發生問題了，請稍後再試一次。",
    notApproved: "這個信箱還沒有開通，請寫信給 cynthia.jeng@gmail.com 洽詢。",
    logout: "登出",
  },
  meditation: {
    pageTitle: "冥想",
    pageDescription: "挑選一個你需要的主題，讓我們一起深呼吸……",
    noVideosYet: "這個主題還沒有加入影片，敬請期待。",
    favorite: "收藏",
    unfavorite: "取消收藏",
    markComplete: "今天完成冥想",
    completedToday: "今天已完成 🌿",
    minutesShort: "分鐘",
    backToThemes: "回到主題",
    backToVideos: "回到影片列表",
  },
  innerDialogue: {
    pageTitle: "內在對話",
    pageDescription: "說給自己聽，把此刻的心情與想法都留下來。",
    tabFreeTalk: "自由傾訴",
    tabGratitude: "感恩日記",
  },
  gratitude: {
    intro: "這裡可以隨口記下每天感恩的 3 件事。",
    placeholder: "今天感恩的 3 件事，用說的或寫的都可以……",
    save: "記下今天的感恩",
    saved: "已記下，謝謝今天的美好",
    empty: "先記下一件感恩的事吧。",
  },
  brainDump: {
    pageTitle: "自由傾訴",
    pageDescription: "自由抒發，把腦袋裡的想法都盡情釋放，留出一些空白的時間，不再耗竭。",
    placeholder: "想到什麼就寫下來，不用整理，先倒出來就好……",
    micStart: "開始語音輸入",
    micStop: "停止語音輸入",
    micUnsupported: "此瀏覽器不支援語音輸入，請直接用打字。",
    saveOnly: "純記錄",
    savedToast: "已儲存這則紀錄",
    export: "匯出",
    exportCopy: "複製到剪貼簿",
    exportCopied: "已複製到剪貼簿",
    exportCopyFailed: "複製失敗，請改用下載或分享。",
    exportDownloadTxt: "下載 .txt",
    exportDownloadMd: "下載 .md",
    exportShare: "分享",
    exportShareUnsupported: "此裝置不支援分享，已改為下載檔案。",
    toTodo: "整理成待辦",
    toTodoPending: "AI 整理中…",
    toTodoFailed: "整理失敗了，原文已經幫你存好，要不要再試一次？",
    toTodoDone: "整理完成！",
    viewTodos: "查看待辦清單",
    emptyInput: "先寫點什麼吧。",
  },
  todos: {
    pageTitle: "待辦清單",
    pageDescription: "AI 幫你整理出的小步驟與情緒紀錄。",
    empty: "還沒有任何待辦或情緒紀錄。",
    emotionLabel: "情緒紀錄",
    todoLabel: "待辦",
  },
  cards: {
    pageTitle: "潛意識指引",
    pageDescription: "靜下心，抽一張卡，聽聽此刻的自己。",
    breathingHint: "跟著呼吸的節奏，慢慢吸氣、慢慢吐氣……",
    skip: "跳過",
    continue: "繼續",
    questionPrompt: "今天想問的問題（可以留空）",
    questionPlaceholder: "例如：這件事我該怎麼看待？",
    drawButton: "抽卡",
    drawing: "翻牌中…",
    guidingQuestionsTitle: "試著想想",
    reflectionLabel: "此刻的感受",
    reflectionPlaceholder: "寫下你此刻的感受……",
    actionLabel: "一個小行動",
    actionPlaceholder: "今天可以做的一件小事……",
    save: "儲存這次抽卡",
    saved: "已儲存",
    addToTodo: "加入 Brain dump 待辦",
    addedToTodo: "已加入待辦清單",
    shareToInstagram: "分享到 Instagram",
    shareToFacebook: "分享到 Facebook",
    shareToLine: "分享到 LINE",
    shareImageDownloadedHint: "圖片已下載，到 Instagram 貼上分享吧。",
    drawAgain: "再抽一次",
    yourQuestion: "你的提問",
  },
  journal: {
    pageTitle: "我的紀錄",
    pageDescription: "回顧冥想、內在對話與抽卡的每一步。",
    gratitudeLabel: "感恩日記",
    empty: "還沒有任何紀錄，去試試三個功能吧。",
    meditationDone: "完成冥想",
    clearAll: "清除所有本地資料",
    clearAllConfirm: "確定要清除全部本地資料嗎？這個動作無法復原。",
    clearAllConfirmButton: "確定清除",
    clearAllDone: "已清除所有本地資料",
  },
} as const;

type Strings = typeof strings;

type DotPath<T, Prefix extends string = ""> = {
  [K in keyof T & string]: T[K] extends string
    ? `${Prefix}${K}`
    : DotPath<T[K], `${Prefix}${K}.`>;
}[keyof T & string];

export type StringKey = DotPath<Strings>;

export function t(key: StringKey): string {
  const parts = key.split(".");
  let value: unknown = strings;
  for (const part of parts) {
    if (typeof value !== "object" || value === null) return key;
    value = (value as Record<string, unknown>)[part];
  }
  return typeof value === "string" ? value : key;
}
