"use client";

import { useActionState } from "react";
import { loginAction, type LoginFormState } from "./actions";
import { t, type StringKey } from "@/lib/i18n/strings";

const initialState: LoginFormState = { status: "idle", message: null };

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="email" className="sr-only">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoFocus
          placeholder={t("login.emailPlaceholder")}
          className="w-full rounded-full border border-sand/60 bg-cream/70 px-4 py-3 text-sm text-ink
            outline-none placeholder:text-ink/40 focus:border-moss dark:border-ink/60 dark:bg-ink/40
            dark:text-cream dark:placeholder:text-cream/40"
        />
      </div>
      {state.message ? (
        <p className="text-sm text-wood">{t(state.message as StringKey)}</p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-moss py-3 text-sm text-cream transition-colors duration-300
          disabled:opacity-60 dark:bg-sand dark:text-ink"
      >
        {pending ? t("login.sending") : t("login.submit")}
      </button>
    </form>
  );
}
