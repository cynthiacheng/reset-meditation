import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";

const ItemSchema = z.object({
  type: z.enum(["todo", "emotion"]),
  text: z.string().min(1),
});

const ResultSchema = z.object({
  items: z.array(ItemSchema).max(20),
});

export type ExtractedItem = z.infer<typeof ItemSchema>;

const SYSTEM_PROMPT = `你是 Reset 應用程式中溫和、不評判的書寫夥伴。使用者會把腦中雜亂的想法（Brain dump）傳給你，請依照以下原則整理：

1. 找出內容中「可以具體行動」的部分，拆解成簡短、可執行的小步驟（type: "todo"）。每一步盡量具體、單一動作，避免模糊或空泛的詞彙。
2. 如果內容中有純粹的情緒抒發、感受描述、抱怨或心情記錄，不要勉強轉成待辦事項，而是保留成一筆「情緒紀錄」（type: "emotion"），文字盡量貼近使用者原本的語氣，可以稍微精煉但不要改變原意，也不要加上安慰或建議。
3. 全程語氣溫暖、不批判、不說教，你的角色是整理者，不是顧問。
4. 如果某段文字既看不出明確行動、也不是情緒抒發（例如單純的事實敘述），可以略過，不必勉強分類。
5. 全部使用繁體中文回覆，不要使用簡體字或英文（專有名詞除外）。`;

let cachedClient: Anthropic | null = null;

function getClient(): Anthropic {
  if (cachedClient) return cachedClient;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not configured");
  }
  cachedClient = new Anthropic({ apiKey });
  return cachedClient;
}

export async function extractItemsFromText(text: string): Promise<ExtractedItem[]> {
  const client = getClient();
  const model = process.env.ANTHROPIC_MODEL || "claude-haiku-4-5-20251001";

  const message = await client.messages.parse({
    model,
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: text }],
    output_config: { format: zodOutputFormat(ResultSchema) },
  });

  if (!message.parsed_output) {
    throw new Error("Claude did not return a parsed output");
  }

  return message.parsed_output.items;
}
