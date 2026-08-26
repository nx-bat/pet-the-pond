export type User = {
  user_id: string;

  privacy: {
    optin: boolean;
  },

  xp: {
    current: number;
  }
};
