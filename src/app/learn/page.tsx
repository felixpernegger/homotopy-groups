import type { Metadata } from "next";
import Link from "next/link";
import { MathText } from "@/components/MathText";

export const metadata: Metadata = { title: "Learn" };

export default function LearnPage() {
  return (
    <>
      <section className="pageIntro shell learnIntro">
        <div><div className="eyebrow">A short field guide</div><h1>How to read the landscape</h1></div>
        <p>You do not need to know spectral sequences to wander here. Four ideas are enough to start seeing the shape of the table.</p>
      </section>
      <div className="shell learnLayout">
        <nav className="contentsCard" aria-label="On this page">
          <strong>In this guide</strong>
          <a href="#coordinates">Coordinates</a>
          <a href="#reading-the-table">The table</a>
          <a href="#notation">Notation</a>
          <a href="#stability">Stability</a>
          <a href="#uncertainty">Uncertainty</a>
        </nav>
        <article className="learnArticle">
          <section id="coordinates">
            <span className="chapterNumber">01</span>
            <div className="eyebrow">Coordinates</div>
            <h2>Maps from one sphere to another</h2>
            <p>The group <MathText value="\\pi_m(S^n)" /> records continuous maps from an <MathText value="m" />-sphere into an <MathText value="n" />-sphere, where maps count as the same when one can be continuously deformed into the other.</p>
            <div className="formulaPlate"><MathText value="\\pi_{n+k}(S^n) = [S^{n+k}, S^n]" block /><span>target sphere <i>n</i> · stem <i>k</i></span></div>
            <p>The Atlas uses <MathText value="n" /> for columns and the difference <MathText value="k=m-n" /> for rows. Thus every square has an unambiguous pair of coordinates.</p>
          </section>
          <section id="reading-the-table">
            <span className="chapterNumber">02</span>
            <div className="eyebrow">The table</div>
            <h2>Right means suspension. Down means complexity.</h2>
            <div className="directionDiagram" aria-label="Diagram showing n increasing right and k increasing down"><div>π<sub>n+k</sub>(S<sup>n</sup>)</div><span className="arrowRight">n increases →</span><span className="arrowDown">k increases ↓</span></div>
            <p>Move right along a row to compare successive suspensions in one stem. Move downward to ask about maps whose source dimension lies farther above the target dimension.</p>
          </section>
          <section id="notation">
            <span className="chapterNumber">03</span>
            <div className="eyebrow">Notation</div>
            <h2>Small labels, full groups</h2>
            <div className="notationExamples">
              <div><strong>0</strong><span>the trivial group</span><MathText value="0" /></div>
              <div><strong>ℤ</strong><span>the infinite cyclic group</span><MathText value="\\mathbb{Z}" /></div>
              <div><strong>4 · 3</strong><span>primary source notation</span><MathText value="\\mathbb{Z}/4 \\oplus \\mathbb{Z}/3 \\cong \\mathbb{Z}/12" /></div>
              <div><strong>2³</strong><span>three copies</span><MathText value="(\\mathbb{Z}/2)^{\\oplus 3}" /></div>
            </div>
            <p>The compact table preserves the decomposition used by its source. Entry pages also calculate conventional invariant factors and display the complete group notation.</p>
          </section>
          <section id="stability">
            <span className="chapterNumber">04</span>
            <div className="eyebrow">Stability</div>
            <h2>Eventually, the answers stop changing</h2>
            <p>Freudenthal suspension implies that, for a fixed stem <MathText value="k" />, the group has reached the stable range once <MathText value="n > k+1" />. The table marks this region in mint.</p>
            <div className="formulaPlate stablePlate"><MathText value="\\pi_{n+k}(S^n) \\cong \\pi_k^{\\mathrm S} \\qquad (n > k+1)" block /><span>The diagonal edge is marked separately.</span></div>
          </section>
          <section id="uncertainty">
            <span className="chapterNumber">05</span>
            <div className="eyebrow">Epistemic honesty</div>
            <h2>Unknown is a mathematical claim</h2>
            <p>An entry is called unknown, partial, or disputed only when a source says so. Coordinates outside this edition are labeled “not in this dataset,” because absence from the Atlas says nothing about the state of mathematics.</p>
            <Link className="button primaryButton" href="/about/data">Read about the dataset →</Link>
          </section>
        </article>
      </div>
    </>
  );
}
