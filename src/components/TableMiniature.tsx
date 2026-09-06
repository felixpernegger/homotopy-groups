import Link from "next/link";
import { sphereEntries } from "@/lib/data";

export function TableMiniature() {
  return (
    <div className="miniTable" aria-label="Miniature map of the homotopy group table">
      {sphereEntries.map((entry) => (
        <Link
          key={entry.id}
          href={`/groups/spheres/${entry.n}/${entry.m}`}
          className={`miniCell kind-${entry.kind} ${entry.stability === "stable" ? "isStable" : ""}`}
          title={`π${entry.m}(S${entry.n}) = ${entry.compact}`}
          aria-label={`pi ${entry.m} of S ${entry.n}: ${entry.compact}`}
        />
      ))}
    </div>
  );
}
