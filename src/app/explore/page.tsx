import type { Metadata } from "next";
import { Suspense } from "react";
import { ExploreClient } from "@/components/ExploreClient";
import { allEntries, curatedCollections } from "@/lib/data";

export const metadata: Metadata = { title: "Explore" };

export default function ExplorePage() {
  return (
    <>
      <section className="pageIntro shell exploreIntro">
        <div><div className="eyebrow">Search, filter, stumble</div><h1>Explore the atlas</h1></div>
        <p>Find a precise coordinate, combine structural properties, or take a curated path through the strange parts.</p>
      </section>
      <Suspense fallback={<div className="shell loadingState">Opening the atlas…</div>}>
        <ExploreClient entries={allEntries} collections={curatedCollections} />
      </Suspense>
    </>
  );
}
