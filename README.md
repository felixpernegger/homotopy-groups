# The Sphere Atlas

An interactive, static-first atlas of the homotopy groups of spheres. The first edition contains the Bielefeld/Toda rectangle for `n = 1…20`, `k = 0…19`, plus the corresponding stable stems.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Verify

```bash
npm run lint
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

## Data

- `data/toda.json` is the reviewed source matrix.
- `data/sources.json` records dataset metadata and provenance.
- `data/enrichments.json` adds curated narratives, generators, and tags without changing group values.
- `data/collections.json` defines the Explore trails.

The normalization layer in `src/lib/data.ts` derives all 420 records. It keeps compact source notation while calculating invariant factors, primary decompositions, prime support, rank, order, and stability. Missing coverage is never represented as mathematical uncertainty.

Public snapshots are available from the running site at `/data/groups.json`, `/data/groups.csv`, and `/data/sources.json`.

## Corrections

Set `NEXT_PUBLIC_REPOSITORY_URL` to the GitHub repository URL to enable pre-filled correction links:

```bash
cp .env.example .env.local
```

Set `NEXT_PUBLIC_SITE_URL` in the same file to the deployed origin for canonical metadata.

All mathematical corrections should cite a publication or stable source and be reviewed through pull requests.
