export interface IUser {
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  picture?: string;
  isAdmin?: boolean;
  hasPaid?: boolean;
  lastSignIn?: Date;
  lastActiveTimestamp?: number;
}

export interface IAuthRedirectUser {
  email?: string;
  accessToken?: string;
  tokenType?: string;
  picture?: string;
}
