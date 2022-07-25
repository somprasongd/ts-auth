export interface AuthRequest {
  email: string;
  password: string;
}

export interface UserInfo {
  id: number;
  email: string;
  role: string;
}

interface TokenInfo {
  token: string;
  expiredAt: Date;
}

export interface AuthResponse {
  user: UserInfo;
  refresh: TokenInfo;
  access: TokenInfo;
}
