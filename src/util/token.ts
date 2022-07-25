import jsonwebtoken from 'jsonwebtoken';
import crypto from 'crypto';

// TODO: read from env
const REFRESH_JWT_SECRET = 'refresh_jwt_secret';
const REFRESH_EXPIRE = '7d';
const ACCESS_JWT_SECRET = 'accress_jwt_secret';
const ACCESS_EXPIRE = '5m';

export interface TokenInfo {
  token: string;
  expiredAt?: Date;
}

export function generateTokenId(): string {
  return crypto.randomBytes(16).toString('hex');
}

export function generateRefreshToken(payload: object): TokenInfo {
  return generateToken(payload, REFRESH_JWT_SECRET, REFRESH_EXPIRE);
}

export function generateAcceesToken(payload: object): TokenInfo {
  return generateToken(payload, ACCESS_JWT_SECRET, ACCESS_EXPIRE);
}
function generateToken(
  payload: object,
  secret: string,
  expire: string
): TokenInfo {
  const token = jsonwebtoken.sign(payload, secret, { expiresIn: expire });
  const decode = jsonwebtoken.decode(token);
  const tokenInfo: TokenInfo = {
    token,
  };
  if (decode) {
    // eslint-disable-next-line prettier/prettier
    const expiresIn = (decode as jsonwebtoken.JwtPayload).exp
    if (expiresIn) {
      tokenInfo.expiredAt = new Date(expiresIn * 1000)
    }
  }

  return tokenInfo;
}

export function decodeToken(token: string) {
  return jsonwebtoken.decode(token);
}

export function verifyRefreshToken(token: string) {
  return verifyToken(token, REFRESH_JWT_SECRET);
}

export function verifyAccessToken(token: string) {
  return verifyToken(token, ACCESS_JWT_SECRET);
}

function verifyToken(token: string, secret: string) {
  return jsonwebtoken.verify(token, secret);
}
