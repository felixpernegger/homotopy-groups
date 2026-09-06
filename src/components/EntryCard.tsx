import Link from "next/link";
import { entryPath, formulaLatex } from "@/lib/data";
import type { GroupEntry } from "@/lib/types";
import { MathText } from "./MathText";

export function EntryCard({ entry, compact = false }: { entry: GroupEntry; compact?: boolean }) {
  return (
    <Link className={`entryCard kind-${entry.kind}${compact ? " compactCard" : ""}`} href={entryPath(entry)}>
      <div className="entryCardTop">
        <MathText value={formulaLatex(entry)} />
        <span className={`statusPill status-${entry.knowledgeStatus}`}>{entry.knowledgeStatus}</span>
      </div>
      <MathText className="entryCardGroup" value={entry.latex} block />
      {!compact && (
        <>
          <p>{entry.summary ?? entry.interestingBecause ?? `The ${entry.k}-stem at this sphere dimension.`}</p>
          <div className="tagRow">
            <span>{entry.stability}</span>
            {entry.primes.map((prime) => <span key={prime}>{prime}-torsion</span>)}
          </div>
        </>
      )}
    </Link>
  );
}
