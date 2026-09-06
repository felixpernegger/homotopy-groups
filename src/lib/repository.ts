import { allEntries, sphereEntries, stableEntries } from "./data";
import type { GroupEntry, GroupRepository } from "./types";

class StaticGroupRepository implements GroupRepository {
  private readonly byId = new Map(allEntries.map((entry) => [entry.id, entry]));

  all(): readonly GroupEntry[] {
    return allEntries;
  }

  sphereEntries(): readonly GroupEntry[] {
    return sphereEntries;
  }

  stableEntries(): readonly GroupEntry[] {
    return stableEntries;
  }

  findById(id: string): GroupEntry | undefined {
    return this.byId.get(id);
  }

  findSphere(n: number, m: number): GroupEntry | undefined {
    return this.findById(`sphere-${n}-${m}`);
  }

  findStable(k: number): GroupEntry | undefined {
    return this.findById(`stable-${k}`);
  }
}

export const groupRepository: GroupRepository = new StaticGroupRepository();

export function relatedEntries(entry: GroupEntry): GroupEntry[] {
  const candidates = allEntries.filter((candidate) => candidate.id !== entry.id);
  const scored = candidates.map((candidate) => {
    let score = 0;
    if (candidate.k === entry.k) score += 5;
    if (candidate.latex === entry.latex) score += 3;
    if (candidate.primes.some((prime) => entry.primes.includes(prime))) score += 1;
    if (
      entry.scope === "sphere" &&
      candidate.scope === "sphere" &&
      candidate.n === entry.n! + 1 &&
      candidate.m === entry.m! + 1
    ) score += 6;
    return { candidate, score };
  });

  return scored
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.candidate.id.localeCompare(b.candidate.id))
    .slice(0, 6)
    .map(({ candidate }) => candidate);
}
