import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../config/env';

const JWT_SECRET = config.jwt.secret;
const JWT_REFRESH_SECRET = config.jwt.refreshSecret;
const JWT_EXPIRE = config.jwt.expire;
const JWT_REFRESH_EXPIRE = config.jwt.refreshExpire;

/**
 * Generar access token
 */
export const generateToken = (userId: string | number): string => {
  const options: SignOptions = {
    expiresIn: JWT_EXPIRE as any,
  };
  return jwt.sign({ id: userId }, JWT_SECRET, options);
};

/**
 * Generar refresh token
 */
export const generateRefreshToken = (userId: string | number): string => {
  const options: SignOptions = {
    expiresIn: JWT_REFRESH_EXPIRE as any,
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
