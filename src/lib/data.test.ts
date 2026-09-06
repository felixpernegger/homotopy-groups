import { describe, expect, it } from "vitest";
import { allEntries, curatedCollections, datasetMetadata, sphereEntries, stableEntries } from "./data";
import { datasetCsv, datasetJson } from "./serialize";

describe("Sphere Atlas dataset", () => {
  it("contains the complete sourced rectangle", () => {
    expect(sphereEntries).toHaveLength(400);
    expect(stableEntries).toHaveLength(20);
    expect(allEntries).toHaveLength(420);
    expect(new Set(allEntries.map((entry) => entry.id)).size).toBe(420);
  });

  it("keeps coordinates and stability internally consistent", () => {
    for (const entry of sphereEntries) {
      expect(entry.m! - entry.n!).toBe(entry.k);
      const expected = entry.n! > entry.k + 1 ? "stable" : entry.n === entry.k + 1 ? "boundary" : "unstable";
      expect(entry.stability).toBe(expected);
    }
  });

  it("requires every record and collection reference to resolve", () => {
    const sourceIds = new Set(datasetMetadata.sources.map((source) => source.id));
    const entryIds = new Set(allEntries.map((entry) => entry.id));
    for (const entry of allEntries) {
      expect(entry.sourceIds.every((id) => sourceIds.has(id))).toBe(true);
      if (entry.knowledgeStatus !== "known") expect(entry.sourceIds.length).toBeGreaterThan(0);
    }
    for (const collection of curatedCollections) {
      expect(collection.entryIds.every((id) => entryIds.has(id))).toBe(true);
    }
  });

  it("exports the same records shown by the site", () => {
    expect(datasetJson(allEntries).entries).toHaveLength(420);
    expect(datasetCsv(allEntries).split("\n")).toHaveLength(421);
  });
});
