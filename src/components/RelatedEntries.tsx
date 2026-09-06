import { EntryCard } from "./EntryCard";
import type { GroupEntry } from "@/lib/types";

export function RelatedEntries({ entries }: { entries: GroupEntry[] }) {
  return (
    <section className="section shell relatedSection">
      <div className="sectionHeading"><div className="eyebrow">Nearby landmarks</div><h2>Continue exploring</h2></div>
      <div className="cardGrid threeUp">{entries.map((entry) => <EntryCard key={entry.id} entry={entry} compact />)}</div>
    </section>
  );
}
