import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EntryDetail } from "@/components/EntryDetail";
import { RelatedEntries } from "@/components/RelatedEntries";
import { datasetMetadata, sphereEntries } from "@/lib/data";
import { groupRepository, relatedEntries } from "@/lib/repository";

export function generateStaticParams() {
  return sphereEntries.map((entry) => ({ n: String(entry.n), m: String(entry.m) }));
}

export async function generateMetadata({ params }: { params: Promise<{ n: string; m: string }> }): Promise<Metadata> {
  const { n, m } = await params;
  const entry = groupRepository.findSphere(Number(n), Number(m));
  return entry ? { title: `π${m}(S${n})`, description: entry.summary ?? `The group π${m}(S${n}) in the ${entry.k}-stem.` } : {};
}

export default async function SphereGroupPage({ params }: { params: Promise<{ n: string; m: string }> }) {
  const { n, m } = await params;
  const entry = groupRepository.findSphere(Number(n), Number(m));
  if (!entry) notFound();
  const source = datasetMetadata.sources.find((item) => item.id === entry.sourceIds[0])!;
  return <><EntryDetail entry={entry} source={source} /><RelatedEntries entries={relatedEntries(entry)} /></>;
}
