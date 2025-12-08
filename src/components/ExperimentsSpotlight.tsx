import ClientExperimentsSpotlight from "./ExperimentsSpotlightClient";
import { getExperiments, experimentRowToMeta } from "@/lib/data/experiments";

export default async function ExperimentsSpotlight() {
  const rows = await getExperiments();
  const experiments = rows.map(experimentRowToMeta);

  const latest = experiments
    .slice()
    .sort(
      (a, b) =>
        new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime()
    )
    .slice(0, 4);

  if (!latest.length) return null;

  return <ClientExperimentsSpotlight experiments={latest} />;
}
