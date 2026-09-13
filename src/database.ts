import postgres from "postgres";

// ----------

const client = postgres(process.env.DATABASE_URL);

async function init() {
  await client`
    CREATE TABLE IF NOT EXISTS points (
      user_id TEXT NOT NULL,
      guild_id TEXT NOT NULL,
      points INTEGER NOT NULL DEFAULT 0 CHECK (points >= 0),

      PRIMARY KEY (user_id, guild_id)
    )
  `;
}

async function getPoints(id: string, guild_id: string): Promise<number> {
  const [row] = await client`
    SELECT points
    FROM points
    WHERE user_id = ${id}
      AND guild_id = ${guild_id}
  `;

  return row?.points ?? 0;
}

async function addPoints(id: string, guild_id: string, count: number) {
  await client`
    INSERT INTO points (user_id, guild_id, points)
    VALUES (${id}, ${guild_id}, ${count})
    ON CONFLICT (user_id, guild_id)
    DO UPDATE SET points = user_points.points + ${count}
  `;
}

async function takePoints(id: string, guild_id: string, count: number) {
  await client`
    INSERT INTO points (user_id, guild_id, points)
    VALUES (${id}, ${guild_id}, 0)
    ON CONFLICT (user_id, guild_id)
    DO UPDATE SET points = GREATEST(user_points.points - ${count}, 0)
  `;
}

// ----------

async function getLeaderboard(guild_id: string, limit: number = 10): Promise<{ user_id: string; points: number }[]> {
  return await client`
    SELECT user_id, points
    FROM points
    WHERE guild_id = ${guild_id}
    ORDER BY points DESC, user_id ASC
    LIMIT ${limit}
  `;
}

async function getLeaderboardPosition(id: string, guild_id: string): Promise<number | null> {
  const [row] = await client`
    SELECT position
    FROM (
      SELECT
        user_id,
        RANK() OVER (ORDER BY points DESC) AS position
      FROM points
      WHERE guild_id = ${guild_id}
    ) leaderboard
    WHERE user_id = ${id}
  `;

  return row?.position ?? null;
}

// ----------

export default {
  points: {
    init,
    getPoints,
    addPoints,
    takePoints
  },

  leaderboard: {
    getLeaderboard,
    getLeaderboardPosition
  }
};