export interface AuthUser {
  id: string; // Unique identifier for the user, likely a UUID or Telegram ID
  username?: string; // Optional username of the user
  first_name?: string; // Optional first name
  last_name?: string; // Optional last name
  photo_url?: string; // Optional URL to the user's profile picture
  auth_date: number; // Timestamp of when the user was authenticated
  hash: string; // Hash for validating user data from Telegram
}
