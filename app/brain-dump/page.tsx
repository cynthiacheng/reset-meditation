import { PageHeader } from "@/components/ui/PageHeader";
import { BrainDumpForm } from "@/components/brain-dump/BrainDumpForm";
import { t } from "@/lib/i18n/strings";

export default function BrainDumpPage() {
  return (
    <div>
      <PageHeader
        title={t("brainDump.pageTitle")}
        description={t("brainDump.pageDescription")}
      />
      <BrainDumpForm />
    </div>
  );
}
