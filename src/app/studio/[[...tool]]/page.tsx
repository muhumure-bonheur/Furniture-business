import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";

export const dynamic = "force-static";

export default function StudioPage() {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    return (
      <main className="mx-auto max-w-xl px-6 py-20">
        <h1 className="font-display text-3xl">Set up Sanity Studio</h1>
        <p className="mt-4 text-muted-foreground">
          Add NEXT_PUBLIC_SANITY_PROJECT_ID to .env.local and restart the server
          to manage your content. The public website requires published Sanity
          content.
        </p>
      </main>
    );
  }

  return <NextStudio config={config} />;
}
