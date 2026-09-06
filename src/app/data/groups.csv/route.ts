import { allEntries } from "@/lib/data";
import { datasetCsv } from "@/lib/serialize";

export const dynamic = "force-static";

export function GET() {
  return new Response(datasetCsv(allEntries), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="sphere-atlas-groups.csv"',
    },
  });
}
