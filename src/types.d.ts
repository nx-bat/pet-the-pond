declare global {
  namespace Application {
    type Configuration = {
      emoji_id: string;
    };
  }

  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      DISCORD_TOKEN: string;
    }
  }
}

export { };
