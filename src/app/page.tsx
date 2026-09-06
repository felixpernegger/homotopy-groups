import Link from "next/link";
import { EntryCard } from "@/components/EntryCard";
import { MathText } from "@/components/MathText";
import { TableMiniature } from "@/components/TableMiniature";
import { allEntries, curatedCollections, datasetMetadata } from "@/lib/data";
import { groupRepository } from "@/lib/repository";

const featuredIds = ["sphere-2-3", "stable-3", "sphere-8-15"];

export default function HomePage() {
  const featured = featuredIds.flatMap((id) => {
    const entry = groupRepository.findById(id);
    return entry ? [entry] : [];
  });

  return (
    <>
      <section className="hero shell">
        <div className="heroCopy">
          <div className="eyebrow">A field guide to unstable terrain</div>
          <h1>The strange landscape between spheres.</h1>
          <p className="heroLead">
            Explore <MathText value="\\pi_{n+k}(S^n)" /> as a table, a collection of stories,
            and a searchable atlas of patterns that stabilize only after a winding journey.
          </p>
          <div className="heroActions">
            <Link className="button primaryButton" href="/table">Open the table <span>→</span></Link>
            <Link className="button ghostButton" href="/explore">Wander the atlas</Link>
          </div>
          <dl className="heroStats">
            <div><dt>{allEntries.length}</dt><dd>charted groups</dd></div>
            <div><dt>20</dt><dd>sphere dimensions</dd></div>
            <div><dt>20</dt><dd>stable stems</dd></div>
          </dl>
        </div>
        <div className="heroMap">
          <div className="orbit orbitOne" aria-hidden="true" />
          <div className="orbit orbitTwo" aria-hidden="true" />
          <TableMiniature />
          <div className="mapCaption">
            <span className="pulseDot" /> Every square is a group. Pick one.
          </div>
        </div>
      </section>

      <section className="section shell">
        <div className="sectionHeading splitHeading">
          <div>
            <div className="eyebrow">Start with a landmark</div>
            <h2>Famous, peculiar, and worth a detour</h2>
          </div>
          <Link className="textLink" href="/explore">See all discoveries →</Link>
        </div>
        <div className="cardGrid">
          {featured.map((entry) => <EntryCard entry={entry} key={entry.id} />)}
        </div>
      </section>

      <section className="section darkSection">
        <div className="shell twoColumnFeature">
          <div>
            <div className="eyebrow lightEyebrow">Two ways in</div>
            <h2>Look something up.<br />Or follow a surprise.</h2>
          </div>
          <div className="collectionList">
            {curatedCollections.slice(0, 4).map((collection, index) => (
              <Link href={`/explore?collection=${collection.slug}`} key={collection.slug}>
                <span>0{index + 1}</span>
                <div><strong>{collection.title}</strong><small>{collection.description}</small></div>
                <b aria-hidden="true">↗</b>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section shell manifesto">
        <div className="eyebrow">What is known?</div>
        <blockquote>
          “A blank in a database is not the same thing as a blank in mathematics.”
        </blockquote>
        <p>
          The Atlas keeps sourced uncertainty separate from its own coverage. This first edition
          records the classical Toda rectangle and says exactly where its map ends.
        </p>
        <Link className="textLink" href="/about/data">How the data works →</Link>
        <small>Dataset {datasetMetadata.datasetVersion}</small>
      </section>
    </>
  );
}
