import { sql } from "drizzle-orm";
import { db } from "@/db/client";

export type DemandRow = {
  origin: string;
  destination: string;
  pain: string;
  votes: number;
};

/**
 * The demand board.
 *
 * Grouped by route *and* the specific gap, because "Manila to Baguio" already
 * has twenty buses — the unmet demand is "Manila to Baguio after 10pm". Counting
 * the route alone would just recount supply that already exists.
 *
 * Grouping is case and whitespace insensitive so "cubao" and "Cubao " land in
 * the same row; the spelling shown is whichever people used most.
 */
export async function getDemandBoard(limit = 8): Promise<DemandRow[]> {
  if (!db) return [];

  const result = await db.execute(sql`
    select
      mode() within group (order by origin) as origin,
      mode() within group (order by destination) as destination,
      pain,
      count(*)::int as votes
    from route_requests
    group by lower(trim(origin)), lower(trim(destination)), pain
    order by count(*) desc, max(created_at) desc
    limit ${limit}
  `);

  const rows = Array.isArray(result) ? result : (result.rows ?? []);
  return rows as DemandRow[];
}
