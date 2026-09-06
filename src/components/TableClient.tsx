"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { entryPath, formulaLatex } from "@/lib/data";
import type { GroupEntry } from "@/lib/types";
import { MathText } from "./MathText";

type DisplayMode = "structure" | "prime" | "stability" | "status";
type Density = "cozy" | "compact";

function cellValue(entry: GroupEntry, mode: DisplayMode) {
  if (mode === "structure") return entry.compact;
  if (mode === "prime") return entry.primes.length ? entry.primes.join(" · ") : "—";
  if (mode === "stability") return entry.stability === "boundary" ? "edge" : entry.stability;
  return entry.knowledgeStatus;
}

function Inspector({ entry, onClose }: { entry: GroupEntry; onClose: () => void }) {
  async function share() {
    const url = `${window.location.origin}${entryPath(entry)}`;
    if (navigator.share) await navigator.share({ title: "The Sphere Atlas", url });
    else await navigator.clipboard.writeText(url);
  }

  return (
    <aside className="inspector" aria-label="Selected group" aria-live="polite">
      <div className="inspectorHandle" aria-hidden="true" />
      <button className="iconButton inspectorClose" onClick={onClose} aria-label="Close inspector">×</button>
      <div className="eyebrow">Selected entry</div>
      <MathText className="inspectorFormula" value={formulaLatex(entry)} block />
      <MathText className="inspectorGroup" value={entry.latex} block />
      <div className="factGrid">
        <div><span>Stem</span><strong>{entry.k}</strong></div>
        <div><span>Region</span><strong>{entry.stability}</strong></div>
        <div><span>Structure</span><strong>{entry.kind}</strong></div>
        <div><span>Status</span><strong>{entry.knowledgeStatus}</strong></div>
      </div>
      <p className="inspectorNote">
        {entry.summary ?? `A ${entry.kind} group in the ${entry.k}-stem, recorded in the Toda table.`}
      </p>
      {entry.primes.length > 0 && (
        <div className="tagRow">{entry.primes.map((prime) => <span key={prime}>{prime}-primary</span>)}</div>
      )}
      <div className="inspectorActions">
        <Link className="button primaryButton" href={entryPath(entry)}>Open full entry <span>→</span></Link>
        <button className="button ghostButton" type="button" onClick={share}>Share</button>
      </div>
    </aside>
  );
}

function MobileSlice({ entries, onSelect }: { entries: GroupEntry[]; onSelect: (entry: GroupEntry) => void }) {
  const [n, setN] = useState(2);
  const sliced = entries.filter((entry) => entry.scope === "sphere" && entry.n === n);
  return (
    <div className="mobileSlice">
      <label className="fieldLabel" htmlFor="sphere-slice">Choose a target sphere</label>
      <select id="sphere-slice" value={n} onChange={(event) => setN(Number(event.target.value))}>
        {Array.from({ length: 20 }, (_, index) => index + 1).map((value) => (
          <option key={value} value={value}>S^{value}</option>
        ))}
      </select>
      <div className="sliceList">
        {sliced.map((entry) => (
          <button key={entry.id} data-cell={`${entry.n}-${entry.k}`} className={`sliceRow kind-${entry.kind}`} onClick={() => onSelect(entry)}>
            <MathText value={formulaLatex(entry)} />
            <strong>{entry.compact}</strong>
            <span>{entry.stability}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function TableClient({ sphereEntries, stableEntries }: { sphereEntries: GroupEntry[]; stableEntries: GroupEntry[] }) {
  const [mode, setMode] = useState<DisplayMode>("structure");
  const [density, setDensity] = useState<Density>("cozy");
  const [selected, setSelected] = useState<GroupEntry | null>(null);
  const [focus, setFocus] = useState<{ n: number | "stable"; k: number } | null>(null);
  const [mobileGrid, setMobileGrid] = useState(false);
  const byCoordinate = useMemo(
    () => new Map(sphereEntries.map((entry) => [`${entry.n}-${entry.k}`, entry])),
    [sphereEntries],
  );

  function moveFocus(event: React.KeyboardEvent<HTMLButtonElement>, n: number, k: number) {
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1],
    };
    const move = moves[event.key];
    if (!move) return;
    event.preventDefault();
    const nextN = Math.min(20, Math.max(1, n + move[0]));
    const nextK = Math.min(19, Math.max(0, k + move[1]));
    document.querySelector<HTMLButtonElement>(`[data-cell="${nextN}-${nextK}"]`)?.focus();
  }

  return (
    <div className="atlasWorkspace">
      <div className="tableToolbar" aria-label="Table controls">
        <div className="segmentedControl" role="group" aria-label="Display mode">
          {(["structure", "prime", "stability", "status"] as DisplayMode[]).map((value) => (
            <button key={value} className={mode === value ? "selected" : ""} onClick={() => setMode(value)}>{value}</button>
          ))}
        </div>
        <div className="segmentedControl densityControl" role="group" aria-label="Table density">
          {(["cozy", "compact"] as Density[]).map((value) => (
            <button key={value} className={density === value ? "selected" : ""} onClick={() => setDensity(value)}>{value}</button>
          ))}
        </div>
      </div>

      <button className="mobileViewToggle" type="button" onClick={() => setMobileGrid((value) => !value)}>
        {mobileGrid ? "← Return to sphere slice" : "View the full grid →"}
      </button>

      <div className="formulaReadout">
        {focus ? (
          <>
            <span>Under the lens</span>
            <MathText value={focus.n === "stable" ? `\\pi_{${focus.k}}^{\\mathrm{S}}` : `\\pi_{${Number(focus.n) + focus.k}}(S^{${focus.n}})`} />
          </>
        ) : (
          <><span>Tip</span><p>Hover or focus a cell to trace its row and column.</p></>
        )}
      </div>

      {!mobileGrid && <MobileSlice entries={sphereEntries} onSelect={setSelected} />}

      <div className={`tableScroller density-${density}${mobileGrid ? " mobileGridVisible" : ""}`} tabIndex={0} aria-label="Scrollable homotopy groups table">
        <table className="homotopyTable">
          <caption className="srOnly">Homotopy groups pi n plus k of the n-sphere</caption>
          <thead>
            <tr>
              <th className="cornerCell"><span>k</span><i>n</i></th>
              {Array.from({ length: 20 }, (_, index) => index + 1).map((n) => (
                <th key={n} className={focus?.n === n ? "axisActive" : ""} scope="col">S<sup>{n}</sup></th>
              ))}
              <th scope="col" className={`stableHeader ${focus?.n === "stable" ? "axisActive" : ""}`}>stable</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 20 }, (_, k) => (
              <tr key={k}>
                <th scope="row" className={focus?.k === k ? "axisActive" : ""}>k={k}</th>
                {Array.from({ length: 20 }, (_, index) => index + 1).map((n) => {
                  const entry = byCoordinate.get(`${n}-${k}`)!;
                  const active = focus?.n === n || focus?.k === k;
                  return (
                    <td
                      key={entry.id}
                      className={`${active ? "traceActive" : ""} ${entry.stability === "stable" ? "stableCell" : ""} ${entry.stability === "boundary" ? "boundaryCell" : ""}`}
                    >
                      <button
                        type="button"
                        data-cell={`${n}-${k}`}
                        className={`groupCell kind-${entry.kind} mode-${mode} status-${entry.knowledgeStatus}`}
                        title={`${entry.compact} · ${entry.stability} · ${entry.knowledgeStatus}`}
                        onFocus={() => setFocus({ n, k })}
                        onMouseEnter={() => setFocus({ n, k })}
                        onMouseLeave={() => setFocus(null)}
                        onKeyDown={(event) => moveFocus(event, n, k)}
                        onClick={() => setSelected(entry)}
                      >
                        {cellValue(entry, mode)}
                      </button>
                    </td>
                  );
                })}
                {(() => {
                  const entry = stableEntries[k];
                  return (
                    <td className={`stableColumn ${focus?.k === k ? "traceActive" : ""}`}>
                      <button
                        type="button"
                        className={`groupCell kind-${entry.kind} mode-${mode}`}
                        onFocus={() => setFocus({ n: "stable", k })}
                        onMouseEnter={() => setFocus({ n: "stable", k })}
                        onMouseLeave={() => setFocus(null)}
                        onClick={() => setSelected(entry)}
                      >
                        {cellValue(entry, mode)}
                      </button>
                    </td>
                  );
                })()}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="tableLegend" aria-label="Legend">
        <strong>Structure</strong>
        <span><i className="legendSwatch kind-trivial" /> trivial</span>
        <span><i className="legendSwatch kind-finite" /> finite</span>
        <span><i className="legendSwatch kind-free" /> free</span>
        <span><i className="legendSwatch kind-mixed" /> mixed</span>
        <span><i className="legendSwatch stableLegend" /> stable range</span>
        <Link href="/learn#reading-the-table">How to read this →</Link>
      </div>

      {selected && <Inspector entry={selected} onClose={() => setSelected(null)} />}
      {selected && <button className="inspectorBackdrop" aria-label="Close inspector" onClick={() => setSelected(null)} />}
    </div>
  );
}
