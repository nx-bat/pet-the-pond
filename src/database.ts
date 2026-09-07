import postgres, { Sql } from 'postgres';

// ----------

const client: Sql<any> = postgres(process.env.DATABASE_URL);

export async function init(): Promise<void> {
  await client`
    CREATE TABLE IF NOT EXISTS guilds (
    guild_id TEXT PRIMARY KEY,
    config JSONB NOT NULL default '{}'::jsonb
  );`

  await client`
    CREATE TABLE IF NOT EXISTS points (
      guild_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      points BIGINT NOT NULL DEFAULT 0,

      PRIMARY KEY (guild_id, user_id),

      CONSTRAINT fk_points_guild
        FOREIGN KEY (guild_id)
        REFERENCES guilds (guild_id)
        ON DELETE CASCADE
    );
  `;
}

//#region Configuration

export async function getOrCreateConfig(guildId: string): Promise<Application.Configuration> {
  const [inserted] = await client<{ config: Application.Configuration }[]>`
    INSERT INTO guilds (guild_id)
    VALUES (${guildId})
    ON CONFLICT (guild_id) DO NOTHING
    RETURNING config
  `;

  if (inserted) return inserted.config;

  const [row] = await client<{ config: Application.Configuration }[]>`
    SELECT config FROM guilds
    WHERE guild_id = ${guildId}
  `;

  return row.config;
}

export async function updateConfig(guildId: string, config: Application.Configuration): Promise<void> {
  await client`
    UPDATE guilds SET config = ${client.json(config)}
    WHERE guild_id = ${guildId}
  `;
}

export async function deleteConfig(guildId: string): Promise<void> {
  await client`
    DELETE FROM guilds
    WHERE guild_id = ${guildId}
  `;
}

//#endregion

//#region Points

export async function getOrCreatePoints(guildId: string, userId: string): Promise<bigint> {
  const [inserted] = await client<{ points: bigint }[]>`
    INSERT INTO points (guild_id, user_id)
    VALUES (${guildId}, ${userId})
    ON CONFLICT (guild_id, user_id) DO NOTHING
    RETURNING points
  `;

  if (inserted) return inserted.points;

  const [row] = await client<{ points: bigint }[]>`
    SELECT points FROM points
    WHERE guild_id = ${guildId} AND user_id = ${userId}
  `;

  return row.points;
}

export async function updatePoints(guildId: string, userId: string, points: bigint): Promise<void> {
  await client`
    UPDATE points SET points = ${points}
    WHERE guild_id = ${guildId} AND user_id = ${userId}
  `;
}

export async function deletePoints(guildId: string, userId: string): Promise<void> {
  await client`
    DELETE FROM points
    WHERE guild_id = ${guildId} AND user_id = ${userId}
  `;
}

//#endregion

//#region Leaderboard

export async function getLeaderboard(guildId: string, limit: number = 10): Promise<{ userId: string; points: bigint }[]> {
  return client<{ userId: string; points: bigint }[]>`
    SELECT user_id AS "userId", points FROM points
    WHERE guild_id = ${guildId} AND points > 0
    ORDER BY points DESC, user_id ASC
    LIMIT ${limit}
  `;
}

export async function getLeaderboardPosition(guildId: string, userId: string): Promise<number | null> {
  const [row] = await client<{ rank: number | null }[]>`
    WITH target AS (
      SELECT points FROM points
      WHERE guild_id = ${guildId} AND user_id = ${userId}
    )
    SELECT CASE WHEN COUNT(target.*) = 0 THEN NULL ELSE COUNT(candidate.*)::int + 1 END AS rank
    FROM target
    LEFT JOIN points AS candidate
      ON candidate.guild_id = ${guildId}
      AND (
        candidate.points > target.points
        OR (candidate.points = target.points AND candidate.user_id < ${userId})
      )
  `;

  return row.rank;
}

//#endregion

export default {
  init,

  config: {
    getOrCreateConfig,
    updateConfig,
    deleteConfig
  },

  points: {
    getOrCreatePoints,
    updatePoints,
    deletePoints
  },

  leaderboard: {
    getLeaderboard,
    getLeaderboardPosition,
  }
}