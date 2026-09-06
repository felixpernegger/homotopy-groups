import type { Metadata } from "next";
import { datasetMetadata } from "@/lib/data";

export const metadata: Metadata = { title: "Data and sources" };

export default function DataPage() {
  const source = datasetMetadata.sources[0];
  return (
    <>
      <section className="pageIntro shell dataIntro">
        <div><div className="eyebrow">Provenance before polish</div><h1>Data, coverage &amp; corrections</h1></div>
        <p>Every displayed value comes from a named source. Every transformation from compact notation to searchable structure is deterministic and tested.</p>
      </section>
      <div className="shell dataLayout">
        <section className="dataMain">
          <div className="dataSection">
            <div className="eyebrow">Coverage</div>
            <h2>One internally consistent rectangle</h2>
            <p>This first edition contains sphere dimensions <strong>n=1…20</strong>, stems <strong>k=0…19</strong>, and the corresponding twenty stable stems: 420 records in total.</p>
            <div className="coverageDiagram" aria-label="Twenty by twenty coverage rectangle with stable column"><div className="coverageGrid">{Array.from({ length: 400 }, (_, i) => <i key={i} />)}</div><div className="coverageStable">stable</div></div>
            <p className="callout"><strong>Coverage is not knowledge.</strong> A coordinate beyond this rectangle is absent from the current dataset, not necessarily unknown to mathematics.</p>
          </div>
          <div className="dataSection">
            <div className="eyebrow">Source</div>
            <h2>{source.title}</h2>
            <p>{source.citation}</p>
            <ul className="sourceMeta"><li><span>Authors / stewards</span>{source.authors.join(", ")}</li><li><span>Accessed</span>{source.accessed}</li><li><span>Source ID</span><code>{source.id}</code></li></ul>
            <a className="button ghostButton" href={source.url} target="_blank" rel="noreferrer">Open original table ↗</a>
          </div>
          <div className="dataSection" id="corrections">
            <div className="eyebrow">Corrections</div>
            <h2>Claims should be reviewable</h2>
            <p>Entry pages generate a correction link when <code>NEXT_PUBLIC_REPOSITORY_URL</code> is configured. Reports must identify the entry, describe the proposed change, and include a supporting publication or stable URL.</p>
            <p>Corrections are reviewed as pull requests to the versioned source files. There is no anonymous or automatic editing of mathematical records.</p>
          </div>
        </section>
        <aside className="downloadPanel">
          <span className="eyebrow">Open data</span>
          <h2>Take the atlas with you</h2>
          <p>Downloads contain the normalized values used to render this edition.</p>
          <a className="downloadLink" href="/data/groups.json"><span><b>JSON</b><small>Structured entries</small></span><strong>↓</strong></a>
          <a className="downloadLink" href="/data/groups.csv"><span><b>CSV</b><small>Flat table export</small></span><strong>↓</strong></a>
          <a className="downloadLink" href="/data/sources.json"><span><b>Sources</b><small>Provenance registry</small></span><strong>↓</strong></a>
          <dl><div><dt>Version</dt><dd>{datasetMetadata.datasetVersion}</dd></div><div><dt>Generated</dt><dd>{datasetMetadata.generatedDate}</dd></div><div><dt>License</dt><dd>Source facts with attribution</dd></div></dl>
        </aside>
      </div>
    </>
  );
}
