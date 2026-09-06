"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { entryPath, formulaLatex, formulaText } from "@/lib/data";
import type { CuratedCollection, GroupEntry, GroupKind, KnowledgeStatus, Stability } from "@/lib/types";
import { MathText } from "./MathText";

type ResultView = "cards" | "table";

function toggle<T extends string>(values: T[], value: T): T[] {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

function ResultCard({
  entry,
  selected,
  onCompare,
}: {
  entry: GroupEntry;
  selected: boolean;
  onCompare: () => void;
}) {
  return (
    <article className={`resultCard kind-${entry.kind}`}>
      <Link href={entryPath(entry)} className="resultCardLink">
        <div className="resultFormula"><MathText value={formulaLatex(entry)} /></div>
        <MathText value={entry.latex} block className="resultGroup" />
        <div className="tagRow">
          <span>{entry.stability}</span>
          <span>{entry.kind}</span>
          {entry.primes.slice(0, 3).map((prime) => <span key={prime}>{prime}-torsion</span>)}
        </div>
        {entry.interestingBecause && <p>{entry.interestingBecause}</p>}
      </Link>
      <button
        className={selected ? "compareButton selected" : "compareButton"}
        type="button"
        onClick={onCompare}
      >
        {selected ? "✓ Comparing" : "+ Compare"}
      </button>
    </article>
  );
}

function ComparisonTray({ entries, onRemove, onClose }: {
  entries: GroupEntry[];
  onRemove: (id: string) => void;
  onClose: () => void;
}) {
  return (
    <section className="comparisonTray" aria-label="Compare selected groups">
      <div className="comparisonHeader">
        <div><span className="eyebrow">Side by side</span><h2>Compare groups</h2></div>
        <button className="iconButton" onClick={onClose} aria-label="Close comparison">×</button>
      </div>
      <div className="comparisonGrid">
        {entries.map((entry) => (
          <article key={entry.id}>
            <button onClick={() => onRemove(entry.id)} aria-label={`Remove ${formulaText(entry)}`}>Remove</button>
            <MathText value={formulaLatex(entry)} block />
            <MathText value={entry.latex} block className="comparisonGroup" />
            <dl>
              <div><dt>Stem</dt><dd>{entry.k}</dd></div>
              <div><dt>Structure</dt><dd>{entry.kind}</dd></div>
              <div><dt>Region</dt><dd>{entry.stability}</dd></div>
              <div><dt>Primes</dt><dd>{entry.primes.join(", ") || "none"}</dd></div>
              <div><dt>Summands</dt><dd>{entry.torsionSummandCount + entry.freeRank}</dd></div>
              <div><dt>Source</dt><dd>{entry.sourceIds.join(", ")}</dd></div>
            </dl>
            <Link href={entryPath(entry)}>Full entry →</Link>
          </article>
        ))}
      </div>
    </section>
  );
}

export function ExploreClient({ entries, collections }: { entries: GroupEntry[]; collections: CuratedCollection[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialCollection = searchParams.get("collection") ?? "";
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [kinds, setKinds] = useState<GroupKind[]>(
    (searchParams.get("kind")?.split(",").filter(Boolean) as GroupKind[]) ?? [],
  );
  const [stabilities, setStabilities] = useState<Stability[]>(
    (searchParams.get("stability")?.split(",").filter(Boolean) as Stability[]) ?? [],
  );
  const [prime, setPrime] = useState(searchParams.get("prime") ?? "");
  const [statuses, setStatuses] = useState<KnowledgeStatus[]>(
    (searchParams.get("status")?.split(",").filter(Boolean) as KnowledgeStatus[]) ?? [],
  );
  const [summands, setSummands] = useState(searchParams.get("summands") ?? "");
  const [nMin, setNMin] = useState(searchParams.get("nMin") ?? "");
  const [nMax, setNMax] = useState(searchParams.get("nMax") ?? "");
  const [mMin, setMMin] = useState(searchParams.get("mMin") ?? "");
  const [mMax, setMMax] = useState(searchParams.get("mMax") ?? "");
  const [kMin, setKMin] = useState(searchParams.get("kMin") ?? "");
  const [kMax, setKMax] = useState(searchParams.get("kMax") ?? "");
  const [collection, setCollection] = useState(initialCollection);
  const [view, setView] = useState<ResultView>("cards");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showCompare, setShowCompare] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (kinds.length) params.set("kind", kinds.join(","));
    if (stabilities.length) params.set("stability", stabilities.join(","));
    if (prime) params.set("prime", prime);
    if (statuses.length) params.set("status", statuses.join(","));
    if (summands) params.set("summands", summands);
    if (nMin) params.set("nMin", nMin);
    if (nMax) params.set("nMax", nMax);
    if (mMin) params.set("mMin", mMin);
    if (mMax) params.set("mMax", mMax);
    if (kMin) params.set("kMin", kMin);
    if (kMax) params.set("kMax", kMax);
    if (collection) params.set("collection", collection);
    const suffix = params.toString();
    window.history.replaceState(null, "", suffix ? `/explore?${suffix}` : "/explore");
  }, [query, kinds, stabilities, prime, statuses, summands, nMin, nMax, mMin, mMax, kMin, kMax, collection]);

  const filtered = useMemo(() => {
    const collectionRecord = collections.find((item) => item.slug === collection);
    const needle = query.toLowerCase().trim();
    return entries.filter((entry) => {
      if (collectionRecord && !collectionRecord.entryIds.includes(entry.id)) return false;
      if (kinds.length && !kinds.includes(entry.kind)) return false;
      if (stabilities.length && !stabilities.includes(entry.stability)) return false;
      if (prime && !entry.primes.includes(Number(prime))) return false;
      if (statuses.length && !statuses.includes(entry.knowledgeStatus)) return false;
      const totalSummands = entry.torsionSummandCount + entry.freeRank;
      if (summands === "4+" && totalSummands < 4) return false;
      if (summands && summands !== "4+" && totalSummands !== Number(summands)) return false;
      if (nMin && (entry.n === null || entry.n < Number(nMin))) return false;
      if (nMax && (entry.n === null || entry.n > Number(nMax))) return false;
      if (mMin && (entry.m === null || entry.m < Number(mMin))) return false;
      if (mMax && (entry.m === null || entry.m > Number(mMax))) return false;
      if (kMin && entry.k < Number(kMin)) return false;
      if (kMax && entry.k > Number(kMax)) return false;
      if (needle) {
        const haystack = [
          entry.id, entry.compact, entry.sourceNotation, entry.title, entry.summary,
          entry.interestingBecause, entry.generators?.join(" "), entry.tags?.join(" "),
          formulaText(entry), entry.kind, entry.stability,
        ].filter(Boolean).join(" ").toLowerCase();
        if (!haystack.includes(needle)) return false;
      }
      return true;
    });
  }, [entries, collections, collection, query, kinds, stabilities, prime, statuses, summands, nMin, nMax, mMin, mMax, kMin, kMax]);

  const selectedEntries = selectedIds.flatMap((id) => {
    const entry = entries.find((candidate) => candidate.id === id);
    return entry ? [entry] : [];
  });

  function clearFilters() {
    setQuery(""); setKinds([]); setStabilities([]); setPrime(""); setStatuses([]); setSummands("");
    setNMin(""); setNMax(""); setMMin(""); setMMax(""); setKMin(""); setKMax(""); setCollection("");
  }

  function compare(id: string) {
    if (selectedIds.includes(id)) setSelectedIds(selectedIds.filter((item) => item !== id));
    else if (selectedIds.length < 3) setSelectedIds([...selectedIds, id]);
  }

  function surprise() {
    const interestingIds = new Set(collections.flatMap((item) => item.entryIds));
    const candidates = entries.filter((entry) => interestingIds.has(entry.id));
    const entry = candidates[Math.floor(Math.random() * candidates.length)];
    router.push(entryPath(entry));
  }

  return (
    <div className="exploreLayout shell">
      <aside className="filterPanel">
        <div className="filterHeader"><h2>Filter the atlas</h2><button onClick={clearFilters}>Reset</button></div>
        <label className="searchField">
          <span>Search</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Hopf, 3-torsion, π₇…" />
        </label>
        <fieldset>
          <legend>Structure</legend>
          {(["trivial", "finite", "free", "mixed"] as GroupKind[]).map((kind) => (
            <label key={kind}><input type="checkbox" checked={kinds.includes(kind)} onChange={() => setKinds(toggle(kinds, kind))} /><span>{kind}</span></label>
          ))}
        </fieldset>
        <fieldset>
          <legend>Region</legend>
          {(["unstable", "boundary", "stable"] as Stability[]).map((stability) => (
            <label key={stability}><input type="checkbox" checked={stabilities.includes(stability)} onChange={() => setStabilities(toggle(stabilities, stability))} /><span>{stability}</span></label>
          ))}
        </fieldset>
        <fieldset>
          <legend>Knowledge status</legend>
          {(["known", "partial", "unknown", "disputed"] as KnowledgeStatus[]).map((status) => (
            <label key={status}><input type="checkbox" checked={statuses.includes(status)} onChange={() => setStatuses(toggle(statuses, status))} /><span>{status}</span></label>
          ))}
        </fieldset>
        <label className="selectField"><span>Contains torsion at</span><select value={prime} onChange={(event) => setPrime(event.target.value)}><option value="">Any prime</option>{[2,3,5,7,11].map((p) => <option key={p} value={p}>{p}</option>)}</select></label>
        <label className="selectField"><span>Number of summands</span><select value={summands} onChange={(event) => setSummands(event.target.value)}><option value="">Any number</option><option value="0">0</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4+">4 or more</option></select></label>
        <fieldset className="rangeFields"><legend>Sphere dimension n</legend><input aria-label="Minimum n" type="number" min="1" max="20" placeholder="min" value={nMin} onChange={(event) => setNMin(event.target.value)} /><span>to</span><input aria-label="Maximum n" type="number" min="1" max="20" placeholder="max" value={nMax} onChange={(event) => setNMax(event.target.value)} /></fieldset>
        <fieldset className="rangeFields"><legend>Homotopy degree m</legend><input aria-label="Minimum m" type="number" min="1" max="39" placeholder="min" value={mMin} onChange={(event) => setMMin(event.target.value)} /><span>to</span><input aria-label="Maximum m" type="number" min="1" max="39" placeholder="max" value={mMax} onChange={(event) => setMMax(event.target.value)} /></fieldset>
        <fieldset className="rangeFields"><legend>Stem k</legend><input aria-label="Minimum k" type="number" min="0" max="19" placeholder="min" value={kMin} onChange={(event) => setKMin(event.target.value)} /><span>to</span><input aria-label="Maximum k" type="number" min="0" max="19" placeholder="max" value={kMax} onChange={(event) => setKMax(event.target.value)} /></fieldset>
        <div className="knowledgeNote"><strong>Knowledge status</strong><p>All entries in this first sourced rectangle are known. Future partial or disputed records will be filterable here without confusing them with absent data.</p></div>
      </aside>

      <div className="exploreResults">
        <div className="collectionsStrip">
          <span className="eyebrow">Curated trails</span>
          <div>{collections.map((item) => <button key={item.slug} className={collection === item.slug ? "active" : ""} onClick={() => setCollection(collection === item.slug ? "" : item.slug)}>{item.title}</button>)}</div>
        </div>
        <div className="resultsHeader">
          <div><span className="resultCount">{filtered.length}</span><h2>{collection ? collections.find((item) => item.slug === collection)?.title : "groups found"}</h2><p>{collection ? collections.find((item) => item.slug === collection)?.description : "Adjust the filters, or let the atlas choose a worthwhile detour."}</p></div>
          <div className="resultsActions"><button className="button surpriseButton" onClick={surprise}>✦ Surprise me</button><div className="segmentedControl"><button className={view === "cards" ? "selected" : ""} onClick={() => setView("cards")}>Cards</button><button className={view === "table" ? "selected" : ""} onClick={() => setView("table")}>List</button></div></div>
        </div>
        {selectedIds.length > 0 && <button className="inlineCompare" onClick={() => setShowCompare(true)}>Compare {selectedIds.length} {selectedIds.length === 1 ? "group" : "groups"} <span>↑</span></button>}

        {view === "cards" ? (
          <div className="resultsGrid">{filtered.slice(0, 120).map((entry) => <ResultCard key={entry.id} entry={entry} selected={selectedIds.includes(entry.id)} onCompare={() => compare(entry.id)} />)}</div>
        ) : (
          <div className="resultTableWrap"><table className="resultTable"><thead><tr><th>Group</th><th>Value</th><th>Stem</th><th>Structure</th><th>Region</th><th /></tr></thead><tbody>{filtered.map((entry) => <tr key={entry.id}><td><Link href={entryPath(entry)}><MathText value={formulaLatex(entry)} /></Link></td><td><MathText value={entry.latex} /></td><td>{entry.k}</td><td>{entry.kind}</td><td>{entry.stability}</td><td><button onClick={() => compare(entry.id)}>{selectedIds.includes(entry.id) ? "✓" : "+ Compare"}</button></td></tr>)}</tbody></table></div>
        )}
        {filtered.length > 120 && view === "cards" && <p className="resultsLimit">Showing the first 120 results. Narrow your search or switch to list view to see all {filtered.length}.</p>}
        {filtered.length === 0 && <div className="emptyState"><span>∅</span><h2>No groups match this map.</h2><button className="textLink" onClick={clearFilters}>Clear the filters and start again →</button></div>}
      </div>

      {selectedIds.length > 0 && <button className="floatingCompare" onClick={() => setShowCompare(true)}>Compare {selectedIds.length} {selectedIds.length === 3 ? "groups" : selectedIds.length === 1 ? "group" : "groups"} <span>↑</span></button>}
      {showCompare && <><button className="comparisonBackdrop" onClick={() => setShowCompare(false)} aria-label="Close comparison" /><ComparisonTray entries={selectedEntries} onRemove={(id) => setSelectedIds(selectedIds.filter((item) => item !== id))} onClose={() => setShowCompare(false)} /></>}
    </div>
  );
}
