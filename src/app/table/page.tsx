import type { Metadata } from "next";
import { MathText } from "@/components/MathText";
import { TableClient } from "@/components/TableClient";
import { sphereEntries, stableEntries } from "@/lib/data";

export const metadata: Metadata = { title: "The table" };

export default function TablePage() {
  return (
    <>
      <section className="pageIntro shell tableIntro">
        <div>
          <div className="eyebrow">The classical view</div>
          <h1>A table of <MathText value="\\pi_{n+k}(S^n)" /></h1>
        </div>
        <p>
          Read down to move away from the diagonal. Read right to suspend. Beyond the mint boundary,
          the groups have stabilized—and the same answer repeats forever.
        </p>
      </section>
      <TableClient sphereEntries={sphereEntries} stableEntries={stableEntries} />
    </>
  );
}
