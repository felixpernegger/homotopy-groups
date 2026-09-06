import { describe, expect, it } from "vitest";
import {
  compactNotation,
  invariantLatex,
  parseSourceNotation,
  primeDivisors,
  toInvariantFactors,
} from "./group-format";

describe("Toda notation", () => {
  it("parses the trivial and infinite groups", () => {
    expect(parseSourceNotation("1")).toEqual([]);
    expect(parseSourceNotation("infty")).toEqual([{ kind: "free", multiplicity: 1 }]);
    expect(compactNotation("infty")).toBe("ℤ");
  });

  it("parses sums and repeated summands", () => {
    expect(parseSourceNotation("8+2^{2}+9")).toEqual([
      { kind: "cyclic", order: 8, multiplicity: 1 },
      { kind: "cyclic", order: 2, multiplicity: 2 },
      { kind: "cyclic", order: 9, multiplicity: 1 },
    ]);
    expect(compactNotation("2^{3}")).toBe("2³");
  });

  it("derives invariant factors from primary pieces", () => {
    const summands = parseSourceNotation("8+4+2+3^{2}+5");
    expect(toInvariantFactors(summands)).toEqual([2, 12, 120]);
    expect(primeDivisors(summands)).toEqual([2, 3, 5]);
  });

  it("combines coprime cyclic pieces conventionally", () => {
    expect(invariantLatex(parseSourceNotation("4+3"))).toBe("\\mathbb{Z}/12");
  });
});
