import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";
import { t } from "@/lib/i18n/strings";

export const metadata: Metadata = {
  title: "登入｜Reset",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm rounded-2xl bg-cream/85 px-6 py-8 shadow-sm backdrop-blur-sm dark:bg-ink/70">
        <h1 className="font-heading text-2xl text-ink dark:text-cream">{t("login.title")}</h1>
        <p className="mt-2 text-sm text-ink/70 dark:text-cream/70">{t("login.description")}</p>
        <div className="mt-6">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
