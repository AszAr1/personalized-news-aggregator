export type UserLoginRequest = {
  username: string
  password: string
}

export type UserLoginResponse = {
  access: string
  refresh: string
}

export type JwtPayload = {
  token_type: string;
  exp: number;
  iat: number;
  jti: string;
  user_id: string;
}