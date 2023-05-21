export type UserRole = 'administrator' | 'customer';

export interface JwtPayload {
  userId: string;
  role: UserRole;
  emailAddress?: string;
}

export interface JwtTokenPayload {
  accessToken: string;
}
