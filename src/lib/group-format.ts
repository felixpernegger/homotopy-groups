import type { GroupKind, GroupSummand } from "./types";

const SUPERSCRIPTS: Record<string, string> = {
  "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴",
  "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹",
};

export function parseSourceNotation(raw: string): GroupSummand[] {
  const value = raw.trim();
  if (value === "1") return [];

  return value.split("+").map((token): GroupSummand => {
    if (token === "infty") return { kind: "free", multiplicity: 1 };
    const match = token.match(/^(\d+)(?:\^\{(\d+)\})?$/);
    if (!match) throw new Error(`Invalid Toda group token: ${token}`);
    return {
      kind: "cyclic",
      order: Number(match[1]),
      multiplicity: match[2] ? Number(match[2]) : 1,
    };
  });
}

export function compactNotation(raw: string): string {
  if (raw === "1") return "0";
  return raw
    .replaceAll("infty", "ℤ")
    .replace(/\^\{(\d+)\}/g, (_, digits: string) =>
      [...digits].map((digit) => SUPERSCRIPTS[digit]).join(""),
    )
    .replaceAll("+", " · ");
}

function expandedOrders(summands: GroupSummand[]): number[] {
  return summands.flatMap((summand) =>
    summand.kind === "cyclic"
      ? Array.from({ length: summand.multiplicity }, () => summand.order)
      : [],
  );
}

function factor(number: number): Map<number, number> {
  const result = new Map<number, number>();
  let remaining = number;
  for (let p = 2; p * p <= remaining; p += 1) {
    while (remaining % p === 0) {
      result.set(p, (result.get(p) ?? 0) + 1);
      remaining /= p;
    }
  }
  if (remaining > 1) result.set(remaining, (result.get(remaining) ?? 0) + 1);
  return result;
}

export function primeDivisors(summands: GroupSummand[]): number[] {
  return [...new Set(expandedOrders(summands).flatMap((order) => [...factor(order).keys()]))].sort(
    (a, b) => a - b,
  );
}

export function toInvariantFactors(summands: GroupSummand[]): number[] {
  const orders = expandedOrders(summands);
  if (orders.length === 0) return [];

  const byPrime = new Map<number, number[]>();
  for (const order of orders) {
    for (const [prime, exponent] of factor(order)) {
      const exponents = byPrime.get(prime) ?? [];
      exponents.push(exponent);
      byPrime.set(prime, exponents);
    }
  }
  const width = Math.max(...[...byPrime.values()].map((values) => values.length));
  const factors = Array.from({ length: width }, () => 1);
  for (const [prime, rawExponents] of byPrime) {
    const exponents = rawExponents.sort((a, b) => a - b);
    const offset = width - exponents.length;
    exponents.forEach((exponent, index) => {
      factors[offset + index] *= prime ** exponent;
    });
  }
  return factors;
}

export function classifyGroup(summands: GroupSummand[]): GroupKind {
  if (summands.length === 0) return "trivial";
  const hasFree = summands.some((summand) => summand.kind === "free");
  const hasTorsion = summands.some((summand) => summand.kind === "cyclic");
  if (hasFree && hasTorsion) return "mixed";
  if (hasFree) return "free";
  return "finite";
}

function cyclicLatex(order: number, multiplicity = 1): string {
  const base = `\\mathbb{Z}/${order}`;
  return multiplicity > 1 ? `(${base})^{\\oplus ${multiplicity}}` : base;
}

export function primaryLatex(summands: GroupSummand[]): string {
  if (summands.length === 0) return "0";
  return summands
    .map((summand) =>
      summand.kind === "free"
        ? summand.multiplicity > 1
          ? `\\mathbb{Z}^{\\oplus ${summand.multiplicity}}`
          : "\\mathbb{Z}"
        : cyclicLatex(summand.order, summand.multiplicity),
    )
    .join(" \\oplus ");
}

export function invariantLatex(summands: GroupSummand[]): string {
  if (summands.length === 0) return "0";
  const freeRank = summands
    .filter((summand) => summand.kind === "free")
    .reduce((sum, summand) => sum + summand.multiplicity, 0);
  const pieces: string[] = [];
  if (freeRank === 1) pieces.push("\\mathbb{Z}");
  if (freeRank > 1) pieces.push(`\\mathbb{Z}^{\\oplus ${freeRank}}`);
  pieces.push(...toInvariantFactors(summands).map((order) => cyclicLatex(order)));
  return pieces.join(" \\oplus ");
}

export function finiteOrder(summands: GroupSummand[]): number | null {
  if (summands.some((summand) => summand.kind === "free")) return null;
  return expandedOrders(summands).reduce((product, order) => product * order, 1);
}

export function torsionSummandCount(summands: GroupSummand[]): number {
  return summands
    .filter((summand) => summand.kind === "cyclic")
    .reduce((sum, summand) => sum + summand.multiplicity, 0);
}

export function freeRank(summands: GroupSummand[]): number {
  return summands
    .filter((summand) => summand.kind === "free")
    .reduce((sum, summand) => sum + summand.multiplicity, 0);
}
