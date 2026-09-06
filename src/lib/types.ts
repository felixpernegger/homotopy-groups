export type KnowledgeStatus = "known" | "partial" | "unknown" | "disputed";
export type Stability = "stable" | "boundary" | "unstable";
export type GroupKind = "trivial" | "finite" | "free" | "mixed";

export interface CyclicSummand {
  kind: "cyclic";
  order: number;
  multiplicity: number;
}

export interface FreeSummand {
  kind: "free";
  multiplicity: number;
}

export type GroupSummand = CyclicSummand | FreeSummand;

export interface SourceRecord {
  id: string;
  title: string;
  authors: string[];
  url: string;
  citation: string;
  accessed: string;
}

export interface GroupEnrichment {
  title?: string;
  summary?: string;
  generators?: string[];
  tags?: string[];
  interestingBecause?: string;
}

export interface GroupEntry extends GroupEnrichment {
  id: string;
  scope: "sphere" | "stable";
  n: number | null;
  m: number | null;
  k: number;
  sourceNotation: string;
  compact: string;
  latex: string;
  primaryLatex: string;
  invariantFactors: number[];
  summands: GroupSummand[];
  kind: GroupKind;
  stability: Stability;
  knowledgeStatus: KnowledgeStatus;
  primes: number[];
  torsionSummandCount: number;
  freeRank: number;
  finiteOrder: number | null;
  sourceIds: string[];
}

export interface CuratedCollection {
  slug: string;
  title: string;
  description: string;
  entryIds: string[];
}

export interface DatasetMetadata {
  datasetVersion: string;
  generatedDate: string;
  sources: SourceRecord[];
}

export interface GroupRepository {
  all(): readonly GroupEntry[];
  sphereEntries(): readonly GroupEntry[];
  stableEntries(): readonly GroupEntry[];
  findById(id: string): GroupEntry | undefined;
  findSphere(n: number, m: number): GroupEntry | undefined;
  findStable(k: number): GroupEntry | undefined;
}
