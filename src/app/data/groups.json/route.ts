import { allEntries } from "@/lib/data";
import { datasetJson } from "@/lib/serialize";

export const dynamic = "force-static";

export function GET() {
  return Response.json(datasetJson(allEntries), {
    headers: { "Content-Disposition": 'attachment; filename="sphere-atlas-groups.json"' },
  });
}
