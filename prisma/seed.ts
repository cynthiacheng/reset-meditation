import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import meditationsData from "../data/meditations.json";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not set");
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

interface LegacyTheme {
  themeId: string;
  themeName: string;
  emoji: string;
  description: string;
}

async function main() {
  const themes = meditationsData as LegacyTheme[];

  for (const [index, theme] of themes.entries()) {
    await prisma.meditationTheme.upsert({
      where: { id: theme.themeId },
      update: {},
      create: {
        id: theme.themeId,
        themeName: theme.themeName,
        emoji: theme.emoji,
        description: theme.description,
        sortOrder: index,
      },
    });
    console.log(`seeded theme: ${theme.themeName}`);
  }

  console.log(`done — ${themes.length} themes seeded (no placeholder videos migrated).`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
