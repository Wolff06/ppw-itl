import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Cargar usuario al iniciar
  useEffect(() => {
    const loadUser = () => {
      try {
        const userData = localStorage.getItem('userData');
        const token = localStorage.getItem('authToken');
        
        if (userData && token) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error al cargar usuario:', error);
        localStorage.removeItem('userData');
        localStorage.removeItem('authToken');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (id_usuario, contrasenia) => {
    try {
      // Consultar usuario en Supabase
      const { data, error } = await supabase
        .from('usuario')
        .select('*')
        .eq('id_usuario', id_usuario.trim())
        .single();

      if (error || !data) {
        return { success: false, message: 'Usuario no encontrado' };
      }

      // Verificar contraseña (usa minúsculas para el campo)
      if (data.contrasenia !== contrasenia) {
        return { success: false, message: 'Contraseña incorrecta' };
      }

      // Obtener información adicional del alumno
      let alumnoInfo = {};
      if (data.tipo && data.tipo.toLowerCase().includes('alumno')) {
        const { data: alumnoData } = await supabase
          .from('alumno')
          .select('semestre, carrera')
          .eq('no_control', id_usuario.trim())
          .single();

        if (alumnoData) {
          alumnoInfo = alumnoData;
        }
      }

      // Crear objeto de usuario (usa minúsculas)
      const userData = {
        id: data.id_usuario,
        nombre: data.nombre,
        apellido: data.apellido,
        tipo: data.tipo,
        nombreCompleto: `${data.nombre} ${data.apellido}`,
        ...alumnoInfo
      };

      // Guardar en estado y localStorage
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('userData', JSON.stringify(userData));
      localStorage.setItem('authToken', `authenticated_${Date.now()}`);

      return { success: true, user: userData };
      
    } catch (error) {
      return { success: false, message: 'Error en el servidor: ' + error.message };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('userData');
    localStorage.removeItem('authToken');
    // Redirigir usando window.location ya que no tenemos navigate aquí
    window.location.href = '/';
  };

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};