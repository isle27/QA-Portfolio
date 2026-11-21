# Hana Chanyalew — QA Portfolio

Static portfolio with a Vercel serverless endpoint for published project cards.

## Shared Neon setup

1. Set `DATABASE_URL` in both the QA and BA Vercel projects to the pooled connection string for the `hana-portfolio` Neon project. Keep it server-side; do not use a `NEXT_PUBLIC_` variable or commit credentials.
2. Run `BA-Portfolio/schema.sql` once in the Neon SQL Editor. It migrates existing Business Analytics content to the `ba` portfolio and seeds the QA project entries under `qa`.
3. Deploy this portfolio. `/api/projects` reads only published rows for `portfolio_id = 'qa'`; the BA portfolio reads only `ba` rows.

After deployment, open `/api/projects` and confirm it returns the expected QA cards. The server logs identify missing configuration and Neon query failures. For local integration testing, run `vercel dev` with the server-side environment configured. A static preview shows the built-in project examples when the API is unavailable. A successful response with no published rows displays an empty state.

The `hana-gen` repository currently has no tracked application files, so it cannot yet be connected in code. When that portfolio is implemented, use the same `DATABASE_URL` and `portfolio_id` scheme to keep its content isolated.
