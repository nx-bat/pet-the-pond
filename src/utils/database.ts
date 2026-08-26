import postgres from "postgres";
import { User } from "../types";

const client = postgres(process.env.DATABASE_URL);

const getDefaultUser = (userId: string): User => ({
  user_id: userId,
  privacy: {
    optin: true,
  },
  xp: {
    current: 0
  },
});

export async function getUser(userId: string): Promise<User> {
  let [user] = await client<{ user_id: string; data: User }[]>`
    SELECT user_id, data
    FROM users
    WHERE user_id = ${userId}
  `;

  if (!user) {
    const defaultUser = getDefaultUser(userId);

    [user] = await client<{ user_id: string; data: User }[]>`
      INSERT INTO users (user_id, data)
      VALUES (${userId}, ${client.json(defaultUser)})
      ON CONFLICT (user_id)
      DO NOTHING
      RETURNING user_id, data
    `;

    if (!user) {
      [user] = await client<{ user_id: string; data: User }[]>`
        SELECT user_id, data FROM users WHERE user_id = ${userId}
      `;
    }
  }

  return user.data;
}

export async function setUser(user: User): Promise<void> {
  await client`
    INSERT INTO users (user_id, data)
    VALUES (${user.user_id}, ${client.json(user)})
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

export async function setUserPrivacy(userId: string, privacy: User["privacy"]): Promise<void> {
  await client`
    UPDATE users
    SET data = jsonb_set(data, '{privacy}', ${client.json(privacy)})
    WHERE user_id = ${userId}
  `;
}

export async function setUserXp(userId: string, xp: User["xp"]): Promise<void> {
  await client`
    UPDATE users
    SET data = jsonb_set(data, '{xp}', ${client.json(xp)})
    WHERE user_id = ${userId}
  `;
}
