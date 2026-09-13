declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      DISCORD_TOKEN: string;
      LOGGING_CHANNEL: string;
    }
  }
}

export {};