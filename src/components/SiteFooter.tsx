import Link from "next/link";
import { datasetMetadata } from "@/lib/data";

export function SiteFooter() {
  return (
    <footer className="siteFooter">
      <div>
        <div className="footerMark">The Sphere Atlas</div>
        <p>A small map of a famously difficult landscape.</p>
      </div>
      <div className="footerLinks">
        <Link href="/about/data">Data &amp; sources</Link>
        <a href="/data/groups.json">JSON</a>
        <a href="/data/groups.csv">CSV</a>
        <span>Dataset {datasetMetadata.datasetVersion}</span>
      </div>
    </footer>
  );
}
