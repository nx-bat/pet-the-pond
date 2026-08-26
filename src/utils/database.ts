import postgres from "postgres";
import { User } from "../types";

// ----------

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
  const [user] = await client<{ user_id: string; data: User }[]>`
    INSERT INTO users (user_id, data)
    VALUES (${userId}, ${JSON.stringify(getDefaultUser(userId))}::jsonb)
    ON CONFLICT (user_id)
    DO UPDATE SET user_id = EXCLUDED.user_id
    RETURNING user_id, data
  `;

  return user.data;
}

export async function setUser(user: User): Promise<void> {
  await client`
    INSERT INTO users (user_id, data)
    VALUES (${user.user_id}, ${JSON.stringify(user)}::jsonb)
    ON CONFLICT (user_id)
    DO UPDATE SET data = EXCLUDED.data
  `;
}

export async function deleteUser(userId: string): Promise<void> {
  await client`
    DELETE FROM users
    WHERE user_id = '${userId}'
  `;
}

export async function setUserPrivacy(userId: string, privacy: User["privacy"]): Promise<void> {
  await client`
    UPDATE users
    SET data = jsonb_set(data, '{privacy}', ${JSON.stringify(privacy)}::jsonb)
    WHERE user_id = '${userId}'
  `;
}

export async function setUserXp(userId: string, xp: User["xp"]): Promise<void> {
  await client`
    UPDATE users
    SET data = jsonb_set(data, '{xp}', ${JSON.stringify(xp)}::jsonb)
    WHERE user_id = '${userId}'
  `;
}
