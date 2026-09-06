import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EntryDetail } from "@/components/EntryDetail";
import { RelatedEntries } from "@/components/RelatedEntries";
import { datasetMetadata, stableEntries } from "@/lib/data";
import { groupRepository, relatedEntries } from "@/lib/repository";

export function generateStaticParams() {
  return stableEntries.map((entry) => ({ k: String(entry.k) }));
}

export async function generateMetadata({ params }: { params: Promise<{ k: string }> }): Promise<Metadata> {
  const { k } = await params;
  const entry = groupRepository.findStable(Number(k));
  return entry ? { title: `Stable ${k}-stem`, description: entry.summary ?? `The stable homotopy group of spheres in stem ${k}.` } : {};
}

export default async function StableGroupPage({ params }: { params: Promise<{ k: string }> }) {
  const { k } = await params;
  const entry = groupRepository.findStable(Number(k));
  if (!entry) notFound();
  const source = datasetMetadata.sources.find((item) => item.id === entry.sourceIds[0])!;
  return <><EntryDetail entry={entry} source={source} /><RelatedEntries entries={relatedEntries(entry)} /></>;
}
