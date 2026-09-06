import { datasetMetadata } from "@/lib/data";

export const dynamic = "force-static";

export function GET() {
  return Response.json(datasetMetadata, {
    headers: { "Content-Disposition": 'attachment; filename="sphere-atlas-sources.json"' },
  });
}
