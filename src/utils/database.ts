import postgres from 'postgres';
import { User } from '../types';

const client = postgres(process.env.DATABASE_URL);

const getDefaultUser = (userId: string): User => ({
  settings: {
    participating: true,
  },

  statistics: {
    pets: 0,
  },
});

export async function getUser(userId: string): Promise<User> {
  let [user] = await client<{ user_id: string; data: User }[]>`
    SELECT user_id, data FROM users
    WHERE user_id = ${userId}
  `;

  if (user) return user.data;

  [user] = await client<{ user_id: string; data: User }[]>`
    INSERT INTO users (user_id, data)
    VALUES (${userId}, ${client.json(getDefaultUser(userId))})
    ON CONFLICT (user_id)
    DO NOTHING
    RETURNING user_id, data
  `;
}

export async function setUser(userId: string, data: User): Promise<void> {
  await client`
    INSERT INTO users (user_id, data)
    VALUES (${userId}, ${client.json(data)})
    ON CONFLICT (user_id)
    DO UPDATE SET data = EXCLUDED.data
  `;
}

export async function deleteUser(userId: string): Promise<void> {
  await client`
    DELETE FROM users
    WHERE user_id = ${userId}
  `;
}

export async function updateUserSettings(userId: string, settings: Partial<User['settings']>): Promise<void> {
  await client`
    UPDATE users
    SET data = jsonb_set(
      data,
      '{settings}',
      data->'settings' || ${client.json(settings)}
    )
    WHERE user_id = ${userId}
  `;
}

export async function updateUserStatistics(userId: string, statistics: Partial<User['statistics']>): Promise<void> {
  await client`
    UPDATE users
    SET data = jsonb_set(
      data,
      '{statistics}',
      data->'statistics' || ${client.json(statistics)}
    )
    WHERE user_id = ${userId}
  `;
}

//#region Leaderboard

export async function getHighestPets(limit = 10): Promise<{ userId: string; pets: number }[]> {
  const users = await client<{ user_id: string; pets: number }[]>`
    SELECT user_id, (data->'statistics'->>'pets')::integer AS pets
    FROM users
    WHERE
      COALESCE((data->'flags'->>'blacklisted')::boolean, false) = false
      AND COALESCE((data->'settings'->>'participating')::boolean, true) = true
    ORDER BY pets DESC, user_id ASC
    LIMIT ${limit}
  `;

  return users.map((user) => ({
    userId: user.user_id,
    pets: user.pets,
  }));
}

export async function getPetPosition(userId: string): Promise<number | null> {
  const result = await client<{ position: number }[]>`
    SELECT position
    FROM (
      SELECT
        user_id,
        RANK() OVER (ORDER BY pets DESC, user_id ASC) AS position
      FROM (
        SELECT
          user_id,
          (data->'statistics'->>'pets')::integer AS pets
        FROM users
        WHERE
          COALESCE((data->'flags'->>'blacklisted')::boolean, false) = false
          AND COALESCE((data->'settings'->>'participating')::boolean, true) = true
      ) ranked
    ) ranked_users
    WHERE user_id = ${userId}
  `;

  return result[0]?.position ?? null;
}

//#endregion
