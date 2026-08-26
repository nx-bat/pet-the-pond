export type UserFlags = {
  blacklisted: boolean;
};

export type UserSettings = {
  participating: boolean;
};

export type UserStatistics = {
  pets: number;
};

/**
 * Database User.
 */
export type User = {
  /**
   * User flags.
   */
  flags: UserFlags;

  /**
   * User settings specific to each user.
   */
  settings: UserSettings;

  /**
   * User statistics.
   */
  statistics: UserStatistics;
}
