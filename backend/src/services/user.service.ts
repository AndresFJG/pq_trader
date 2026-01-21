import { supabase } from '../config/supabase';
import bcrypt from 'bcryptjs';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user' | 'mentor';
  subscription_tier: 'free' | 'basic' | 'premium' | 'enterprise';
  subscription_status: 'active' | 'canceled' | 'past_due' | 'trialing' | 'none';
  is_email_verified: boolean;
  created_at: string;
  updated_at: string;
}

export class UserService {
  /**
   * Crear un nuevo usuario en Supabase
   */
  static async createUser(data: {
    name: string;
    email: string;
    password: string;
    role?: 'admin' | 'user' | 'mentor';
  }): Promise<User> {
    const passwordHash = await bcrypt.hash(data.password, 10);

    const { data: user, error } = await supabase
      .from('users')
      .insert([
        {
          name: data.name,
          email: data.email,
          password: passwordHash,
          role: data.role || 'user',
          subscription_tier: 'free',
          subscription_status: 'none',
          is_email_verified: false,
        },
      ])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return user as User;
  }

  /**
   * Buscar usuario por email
   */
  static async findByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No encontrado
        return null;
      }
      throw new Error(error.message);
    }

    return data as User;
  }

  /**
   * Buscar usuario por ID
   */
  static async findById(id: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(error.message);
    }

    return data as User;
  }

  /**
   * Comparar contraseña
   */
  static async comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  /**
   * Actualizar usuario
   */
  static async updateUser(
    id: string,
    updates: Partial<User>
  ): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data as User;
  }

  /**
   * Eliminar usuario
   */
  static async deleteUser(id: string): Promise<void> {
    const { error } = await supabase.from('users').delete().eq('id', id);

    if (error) {
      throw new Error(error.message);
    }
  }
}
