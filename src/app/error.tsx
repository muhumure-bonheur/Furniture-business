"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <div className="grid min-h-[60vh] place-items-center px-4 py-20 text-center"><div><p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Something went wrong</p><h1 className="mt-4 font-display text-4xl tracking-[-0.04em]">We couldn&apos;t load this page.</h1><p className="mt-4 text-sm text-muted-foreground">Please try again, or contact the team directly.</p><button type="button" onClick={() => reset()} className="mt-8 border border-foreground px-5 py-3 text-sm font-semibold">Try again</button></div></div>;
}
