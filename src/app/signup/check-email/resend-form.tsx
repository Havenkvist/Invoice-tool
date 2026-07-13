"use client";

import { useActionState } from "react";
import { resendVerificationAction } from "./actions";

export default function ResendForm({ defaultEmail }: { defaultEmail?: string }) {
  const [message, formAction, pending] = useActionState(
    resendVerificationAction,
    undefined,
  );

  return (
    <form action={formAction} className="mt-6 flex flex-col gap-3">
      <input
        name="email"
        type="email"
        defaultValue={defaultEmail}
        required
        placeholder="din@email.dk"
        className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
      />
      <button
        type="submit"
        disabled={pending}
        className="w-fit text-sm text-zinc-600 hover:text-zinc-900 disabled:opacity-60 dark:text-zinc-400 dark:hover:text-zinc-100"
      >
        {pending ? "Sender…" : "Send linket igen"}
      </button>
      {message && <p className="text-sm text-zinc-500">{message}</p>}
    </form>
  );
}
