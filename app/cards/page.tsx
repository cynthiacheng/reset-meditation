import { PageHeader } from "@/components/ui/PageHeader";
import { DrawFlow } from "@/components/cards/DrawFlow";
import { t } from "@/lib/i18n/strings";

export default function CardsPage() {
  return (
    <div>
      <PageHeader title={t("cards.pageTitle")} description={t("cards.pageDescription")} />
      <DrawFlow />
    </div>
  );
}
