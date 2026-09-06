import Link from "next/link";

export default function NotFound() {
  return (
    <section className="notFound shell">
      <span>∅</span>
      <div className="eyebrow">Outside the current map</div>
      <h1>This entry is not in the Atlas.</h1>
      <p>That does not mean the mathematics is unknown—only that this first edition does not cover the requested coordinate.</p>
      <div className="heroActions"><Link className="button primaryButton" href="/table">Return to the table</Link><Link className="button ghostButton" href="/about/data">Check coverage</Link></div>
    </section>
  );
}
