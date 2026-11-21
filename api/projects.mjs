import { neon } from "@neondatabase/serverless";

export default async function handler(request, response) {
  response.setHeader("Cache-Control", "no-store");

  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return response.status(405).json({ error: "Method not allowed" });
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("QA projects: DATABASE_URL is missing.");
    return response.status(503).json({ error: "Projects are temporarily unavailable" });
  }

  try {
    const sql = neon(databaseUrl, {
      fetchOptions: { signal: AbortSignal.timeout(7000) },
    });
    const projects = await sql`
      SELECT id, number, category, title, summary, tags
      FROM projects
      WHERE portfolio_id = 'qa' AND is_published = TRUE
      ORDER BY sort_order, created_at DESC, id
    `;

    response.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
    return response.status(200).json({ projects });
  } catch (error) {
    const code = typeof error?.code === "string" && /^[A-Z0-9]{5}$/.test(error.code)
      ? error.code
      : "unavailable";
    console.error("QA projects: Neon query failed.", code);
    return response.status(503).json({ error: "Projects are temporarily unavailable" });
  }
}
