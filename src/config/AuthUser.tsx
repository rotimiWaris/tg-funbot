export interface AuthUser {
  id: string; // Unique identifier for the user, likely a UUID or Telegram ID
  username?: string; // Optional username of the user
  high_score?: number;
  first_name?: string; // Optional first name
  last_name?: string; // Optional last name
}
