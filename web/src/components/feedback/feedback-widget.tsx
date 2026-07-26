"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Check, MessageCircle, Send, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { submitFeedback } from "@/lib/listening-actions";
import { initialActionState } from "@/lib/listening-state";

export function FeedbackWidget() {
  const [open, setOpen] = React.useState(false);
  const [sessionKey, setSessionKey] = React.useState(0);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Send feedback"
        className={cn(
          "fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-[color:var(--primary)] text-[color:var(--primary-foreground)] px-4 h-11 text-sm font-medium shadow-[0_12px_32px_-12px_oklch(0.16_0.05_250/0.5)] hover:opacity-95 transition-opacity",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--accent)]"
        )}
      >
        <MessageCircle className="size-4" />
        <span className="hidden sm:inline">Feedback</span>
      </button>

      {open ? (
        <FeedbackPanel
          key={sessionKey}
          onClose={(submitted) => {
            setOpen(false);
            if (submitted) setSessionKey((k) => k + 1);
          }}
        />
      ) : null}
    </>
  );
}

function FeedbackPanel({ onClose }: { onClose: (submitted: boolean) => void }) {
  const pathname = usePathname();
  const [state, formAction, pending] = React.useActionState(
    submitFeedback,
    initialActionState,
  );

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose(state.ok);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, state.ok]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Send feedback"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end p-0 sm:p-5 bg-[color:var(--primary)]/40 backdrop-blur-sm"
      onClick={() => onClose(state.ok)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:w-[24rem] rounded-t-2xl sm:rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-3 mb-1">
          <div>
            <p className="font-semibold tracking-tight">
              {state.ok ? "Thanks — we read every one." : "What's on your mind?"}
            </p>
            <p className="text-xs text-[color:var(--muted)] mt-0.5">
              {state.ok
                ? "We'll get back to you if you left contact info."
                : "Bug, idea, missing route, anything. Closed beta — your voice shapes this."}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onClose(state.ok)}
            aria-label="Close feedback"
            className="text-[color:var(--muted)] hover:text-[color:var(--foreground)] -mt-1 -mr-1 p-1"
          >
            <X className="size-4" />
          </button>
        </div>

        {state.ok ? (
          <div className="mt-5 rounded-xl border border-[color:var(--success)]/30 bg-[color:var(--success)]/10 p-4 flex items-start gap-3">
            <span className="flex size-8 items-center justify-center rounded-full bg-[color:var(--success)]/20 text-[color:var(--success)] flex-shrink-0">
              <Check className="size-4" />
            </span>
            <p className="text-sm text-[color:var(--foreground)] leading-relaxed">
              Logged from <code className="tnum text-[color:var(--muted)]">{pathname}</code>.
              We&apos;ll fold it into the next iteration.
            </p>
          </div>
        ) : (
          <form action={formAction} className="mt-4">
            <input type="hidden" name="pagePath" value={pathname} />
            <textarea
              name="message"
              required
              rows={4}
              autoFocus
              placeholder="The trip detail page is missing the operator phone number. Also: please open Cubao → Banaue."
              className="w-full px-4 py-3 rounded-xl border border-[color:var(--border-strong)] bg-[color:var(--background)] text-sm outline-none focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--accent)]/20 transition-all resize-none"
            />
            <input
              name="contact"
              placeholder="Email or mobile (optional)"
              className="mt-2 w-full h-11 px-4 rounded-xl border border-[color:var(--border-strong)] bg-[color:var(--background)] text-sm outline-none focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--accent)]/20 transition-all"
            />
            {state.error ? (
              <p role="alert" className="mt-2 text-xs text-[color:var(--danger)]">
                {state.error}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={pending}
              className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--accent)] text-[color:var(--accent-foreground)] h-11 text-sm font-medium hover:brightness-105 transition-all disabled:opacity-50 disabled:pointer-events-none"
            >
              {pending ? "Sending…" : <>Send feedback <Send className="size-3.5" /></>}
            </button>
            <p className="text-[0.65rem] uppercase tracking-[0.08em] text-[color:var(--muted)] mt-3 text-center">
              From {pathname}
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
