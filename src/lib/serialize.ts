import { datasetMetadata } from "./data";
import type { GroupEntry } from "./types";

export function publicEntry(entry: GroupEntry) {
  return {
    id: entry.id,
    scope: entry.scope,
    n: entry.n,
    m: entry.m,
    k: entry.k,
    group: entry.latex,
    primaryDecomposition: entry.primaryLatex,
    sourceNotation: entry.sourceNotation,
    kind: entry.kind,
    stability: entry.stability,
    knowledgeStatus: entry.knowledgeStatus,
    primes: entry.primes,
    generators: entry.generators ?? [],
    tags: entry.tags ?? [],
    sourceIds: entry.sourceIds,
  };
}

export function datasetJson(entries: readonly GroupEntry[]) {
  return {
    datasetVersion: datasetMetadata.datasetVersion,
    generatedDate: datasetMetadata.generatedDate,
    entries: entries.map(publicEntry),
  };
}

function csvCell(value: unknown): string {
  const string = Array.isArray(value) ? value.join("|") : String(value ?? "");
  return `"${string.replaceAll('"', '""')}"`;
}

export function datasetCsv(entries: readonly GroupEntry[]): string {
  const header = [
    "id", "scope", "n", "m", "k", "group_latex", "primary_latex", "source_notation",
    "kind", "stability", "knowledge_status", "primes", "generators", "source_ids",
  ];
  const rows = entries.map((entry) => {
    const item = publicEntry(entry);
    return [
      item.id, item.scope, item.n, item.m, item.k, item.group, item.primaryDecomposition,
      item.sourceNotation, item.kind, item.stability, item.knowledgeStatus, item.primes,
      item.generators, item.sourceIds,
    ].map(csvCell).join(",");
  });
  return [header.map(csvCell).join(","), ...rows].join("\n");
}
