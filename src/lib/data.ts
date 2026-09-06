import toda from "../../data/toda.json";
import sources from "../../data/sources.json";
import collections from "../../data/collections.json";
import enrichments from "../../data/enrichments.json";
import {
  classifyGroup,
  compactNotation,
  finiteOrder,
  freeRank,
  invariantLatex,
  parseSourceNotation,
  primeDivisors,
  primaryLatex,
  toInvariantFactors,
  torsionSummandCount,
} from "./group-format";
import type {
  CuratedCollection,
  DatasetMetadata,
  GroupEnrichment,
  GroupEntry,
  Stability,
} from "./types";

const enrichmentMap = enrichments as Record<string, GroupEnrichment>;

function stabilityFor(n: number, k: number): Stability {
  if (n > k + 1) return "stable";
  if (n === k + 1) return "boundary";
  return "unstable";
}

function makeEntry(
  id: string,
  scope: "sphere" | "stable",
  n: number | null,
  m: number | null,
  k: number,
  sourceNotation: string,
): GroupEntry {
  const summands = parseSourceNotation(sourceNotation);
  return {
    id,
    scope,
    n,
    m,
    k,
    sourceNotation,
    compact: compactNotation(sourceNotation),
    latex: invariantLatex(summands),
    primaryLatex: primaryLatex(summands),
    invariantFactors: toInvariantFactors(summands),
    summands,
    kind: classifyGroup(summands),
    stability: scope === "stable" ? "stable" : stabilityFor(n!, k),
    knowledgeStatus: "known",
    primes: primeDivisors(summands),
    torsionSummandCount: torsionSummandCount(summands),
    freeRank: freeRank(summands),
    finiteOrder: finiteOrder(summands),
    sourceIds: [toda.sourceId],
    ...(enrichmentMap[id] ?? {}),
  };
}

export const sphereEntries: GroupEntry[] = toda.rows.flatMap((row) =>
  toda.sphereDimensions.map((n, index) =>
    makeEntry(`sphere-${n}-${n + row.k}`, "sphere", n, n + row.k, row.k, row.values[index]),
  ),
);

export const stableEntries: GroupEntry[] = toda.rows.map((row) =>
  makeEntry(`stable-${row.k}`, "stable", null, null, row.k, row.stable),
);

export const allEntries = [...sphereEntries, ...stableEntries];
export const datasetMetadata = sources as DatasetMetadata;
export const curatedCollections = collections as CuratedCollection[];

export const interestingEntryIds = new Set(
  curatedCollections.flatMap((collection) => collection.entryIds),
);

export function entryPath(entry: GroupEntry): string {
  return entry.scope === "stable"
    ? `/groups/stable/${entry.k}`
    : `/groups/spheres/${entry.n}/${entry.m}`;
}

export function formulaLatex(entry: GroupEntry): string {
  return entry.scope === "stable"
    ? `\\pi_{${entry.k}}^{\\mathrm{S}}`
    : `\\pi_{${entry.m}}(S^{${entry.n}})`;
}

export function formulaText(entry: GroupEntry): string {
  return entry.scope === "stable"
    ? `stable ${entry.k}-stem`
    : `π${entry.m}(S${entry.n})`;
}
