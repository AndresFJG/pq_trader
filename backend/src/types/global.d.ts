/**
 * Declaraciones globales de tipos
 */

import { User as UserType } from './database.types';

declare global {
  // Hacer que User esté disponible globalmente
  type User = UserType;
  
  // Namespace para extender Express
  namespace Express {
    interface Request {
      user?: UserType;
    }
  }
}

export {};
