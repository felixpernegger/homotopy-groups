"use client";

import { useState } from "react";
import type { GroupEntry, SourceRecord } from "@/lib/types";
import { entryPath, formulaLatex } from "@/lib/data";
import { withBasePath } from "@/lib/paths";
import { MathText } from "./MathText";

type Notation = "conventional" | "primary" | "source";

export function EntryDetail({ entry, source }: { entry: GroupEntry; source: SourceRecord }) {
  const [notation, setNotation] = useState<Notation>("conventional");
  const notationValue = notation === "conventional" ? entry.latex : notation === "primary" ? entry.primaryLatex : null;

  async function share() {
    const url = window.location.href;
    if (navigator.share) await navigator.share({ title: `The Sphere Atlas — ${entry.id}`, url });
    else await navigator.clipboard.writeText(url);
  }

  const issueTitle = encodeURIComponent(`[data] ${entry.id}`);
  const issueBody = encodeURIComponent(`Entry: ${entry.id}\nPath: ${entryPath(entry)}\n\nProposed correction:\n\nSupporting source:\n`);
  const repository = process.env.NEXT_PUBLIC_REPOSITORY_URL;

  return (
    <article className="entryDetail">
      <section className={`entryHero kind-${entry.kind}`}>
        <div className="shell entryHeroInner">
          <div>
            <div className="eyebrow">{entry.title ?? (entry.scope === "stable" ? `Stable stem ${entry.k}` : `Sphere ${entry.n}, stem ${entry.k}`)}</div>
            <h1><MathText value={formulaLatex(entry)} /></h1>
            <div className="entryEquals"><span>is</span>{notationValue ? <MathText value={notationValue} block /> : <strong>{entry.sourceNotation}</strong>}</div>
            <div className="segmentedControl notationToggle" role="group" aria-label="Notation">
              {(["conventional", "primary", "source"] as Notation[]).map((value) => <button key={value} className={notation === value ? "selected" : ""} onClick={() => setNotation(value)}>{value}</button>)}
            </div>
          </div>
          <div className="entryLocation" aria-label="Location in the table">
            <span>location</span>
            <div className="locationGrid" style={{ "--x": entry.n ?? 20, "--y": entry.k + 1 } as React.CSSProperties}>
              <i />
            </div>
            <small>{entry.scope === "stable" ? `stable column · k=${entry.k}` : `column n=${entry.n} · row k=${entry.k}`}</small>
          </div>
        </div>
      </section>

      <div className="shell entryBody">
        <div className="entryNarrative">
          <section>
            <div className="eyebrow">At a glance</div>
            <p className="entrySummary">{entry.summary ?? `This ${entry.kind} group lies in the ${entry.k}-stem and is ${entry.stability} at this sphere dimension.`}</p>
            {entry.interestingBecause && <p>{entry.interestingBecause}</p>}
          </section>

          {entry.generators?.length ? (
            <section>
              <h2>Recorded generators</h2>
              <div className="generatorList">{entry.generators.map((generator) => <span key={generator}>{generator}</span>)}</div>
              <p className="mutedText">Generator information is curated separately from the abstract group decomposition and may be incomplete.</p>
            </section>
          ) : null}

          <section>
            <h2>Decomposition</h2>
            <div className="decompositionRows">
              <div><span>Invariant factors</span><MathText value={entry.latex} /></div>
              <div><span>Source / primary form</span><MathText value={entry.primaryLatex} /></div>
              <div><span>Compact source notation</span><strong>{entry.sourceNotation}</strong></div>
            </div>
          </section>

          <section className="exhibitPlaceholder">
            <div><span>Future exhibit</span><h2>A geometric representative could live here.</h2></div>
            <p>Interactive exhibits are reserved for a later edition. Data and narrative remain usable without WebGL or JavaScript.</p>
          </section>
        </div>

        <aside className="entryFacts">
          <div className="factCard">
            <h2>Coordinates</h2>
            <dl>
              {entry.n !== null && <div><dt>Sphere n</dt><dd>{entry.n}</dd></div>}
              {entry.m !== null && <div><dt>Homotopy degree m</dt><dd>{entry.m}</dd></div>}
              <div><dt>Stem k</dt><dd>{entry.k}</dd></div>
              <div><dt>Region</dt><dd><span className="statusPill">{entry.stability}</span></dd></div>
            </dl>
          </div>
          <div className="factCard">
            <h2>Algebra</h2>
            <dl>
              <div><dt>Kind</dt><dd>{entry.kind}</dd></div>
              <div><dt>Free rank</dt><dd>{entry.freeRank}</dd></div>
              <div><dt>Torsion summands</dt><dd>{entry.torsionSummandCount}</dd></div>
              <div><dt>Prime support</dt><dd>{entry.primes.join(", ") || "none"}</dd></div>
              <div><dt>Finite order</dt><dd>{entry.finiteOrder === null ? "infinite" : entry.finiteOrder.toLocaleString()}</dd></div>
            </dl>
          </div>
          <div className="factCard sourceCard">
            <div className="sourceHeading"><h2>Provenance</h2><span className="statusPill status-known">known</span></div>
            <p>{source.citation}</p>
            <a href={source.url} target="_blank" rel="noreferrer">Open source ↗</a>
            <small>Accessed {source.accessed}</small>
          </div>
          <div className="entryActions">
            <button className="button ghostButton" onClick={share}>Share entry</button>
            {repository ? <a className="button ghostButton" href={`${repository}/issues/new?title=${issueTitle}&body=${issueBody}`}>Report a correction</a> : <a className="button ghostButton" href={withBasePath("/about/data#corrections")}>Report a correction</a>}
          </div>
        </aside>
      </div>
    </article>
  );
}
