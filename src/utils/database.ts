import postgres from "postgres";
import { User } from "../types";

const client = postgres(process.env.DATABASE_URL);

const getDefaultUser = (userId: string): User => ({
  flags: {
    blacklisted: false
  },

  settings: {
    participating: true,
  },

  statistics: {
    pets: 0
  }
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

export async function updateUserFlags(userId: string, flags: Partial<User["flags"]>): Promise<void> {
  await client`
    UPDATE users
    SET data = jsonb_set(
      data,
      '{flags}',
      data->'flags' || ${client.json(flags)}
    )
    WHERE user_id = ${userId}
  `;
}

export async function updateUserSettings(userId: string, settings: Partial<User["settings"]>): Promise<void> {
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

export async function updateUserStatistics(userId: string, statistics: Partial<User["statistics"]>): Promise<void> {
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
