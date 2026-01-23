'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import type { User, ApiResponse } from '@/types';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await api.get<ApiResponse<User>>('/auth/me');
      if (response.data.success && response.data.data) {
        setUser(response.data.data);
      }
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post<ApiResponse<{ user: User; token: string; refreshToken: string }>>('/auth/login', {
        email,
        password,
      });

      if (response.data.success && response.data.data) {
        const { user, token, refreshToken } = response.data.data;
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        setUser(user);
        toast.success('¡Bienvenido de nuevo!');
        
        // Solo redirigir a admin si es admin, usuarios normales se quedan en home
        if (user.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/');
        }
      }
    } catch (error: any) {
      // Manejo específico de errores según el código HTTP
      if (error.response?.status === 401) {
        toast.error('❌ Usuario o contraseña incorrectos. Por favor, verifica tus credenciales.', {
          duration: 4000,
          position: 'top-center',
          style: {
            background: '#FF3B30',
            color: '#fff',
            fontWeight: '600',
            padding: '16px 24px',
            borderRadius: '12px',
          },
          icon: '🔒',
        });
      } else if (error.response?.status === 400) {
        toast.error('Datos inválidos. Revisa el formulario.', {
          duration: 3000,
        });
      } else if (error.response?.status === 500) {
        toast.error('Error del servidor. Intenta nuevamente más tarde.', {
          duration: 3000,
        });
      } else {
        toast.error(error.response?.data?.error || 'Error al iniciar sesión. Verifica tu conexión.', {
          duration: 3000,
        });
      }
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await api.post<ApiResponse<{ user: User; token: string; refreshToken: string }>>('/auth/register', {
        name,
        email,
        password,
      });

      if (response.data.success && response.data.data) {
        const { user, token, refreshToken } = response.data.data;
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        setUser(user);
        toast.success('🎉 ¡Cuenta creada exitosamente!', {
          duration: 3000,
          position: 'top-center',
          style: {
            background: '#00C853',
            color: '#fff',
            fontWeight: '600',
            padding: '16px 24px',
            borderRadius: '12px',
          },
        });
        router.push('/');
      }
    } catch (error: any) {
      if (error.response?.status === 400) {
        toast.error('❌ Este correo ya está registrado. Intenta iniciar sesión.', {
          duration: 4000,
          position: 'top-center',
          style: {
            background: '#FF3B30',
            color: '#fff',
            fontWeight: '600',
            padding: '16px 24px',
            borderRadius: '12px',
          },
        });
      } else {
        toast.error(error.response?.data?.error || 'Error al registrarse. Intenta nuevamente.', {
          duration: 3000,
        });
      }
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setUser(null);
    toast.success('Sesión cerrada');
    router.push('/');
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
