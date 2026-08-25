// Used for typing purposes only.
// There's an expectation that the person setting up the bot isn't a complete idiot.
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      DEV_GUILD: string;
      DISCORD_TOKEN: string;
    }
  }
}

export {};
