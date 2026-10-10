import { PageHeader } from "@/components/ui/PageHeader";
import { InnerDialogueTabs } from "@/components/brain-dump/InnerDialogueTabs";
import { t } from "@/lib/i18n/strings";

export default function InnerDialoguePage() {
  return (
    <div>
      <PageHeader
        title={t("innerDialogue.pageTitle")}
        description={t("innerDialogue.pageDescription")}
      />
      <InnerDialogueTabs />
    </div>
  );
}
