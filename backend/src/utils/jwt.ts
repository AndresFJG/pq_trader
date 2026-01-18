import jwt, { SignOptions } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
const JWT_EXPIRE = process.env.JWT_EXPIRE || '15m';
const JWT_REFRESH_EXPIRE = process.env.JWT_REFRESH_EXPIRE || '7d';

/**
 * Generar access token
 */
export const generateToken = (userId: string): string => {
  const options: SignOptions = {
    expiresIn: JWT_EXPIRE,
  };
  return jwt.sign({ id: userId }, JWT_SECRET, options);
};

/**
 * Generar refresh token
 */
export const generateRefreshToken = (userId: string): string => {
  const options: SignOptions = {
    expiresIn: JWT_REFRESH_EXPIRE,
  };
  return jwt.sign({ id: userId }, JWT_REFRESH_SECRET, options);
};

/**
 * Verificar access token
 */
export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

/**
 * Verificar refresh token
 */
export const verifyRefreshToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET);
  } catch (error) {
    return null;
  }
};
