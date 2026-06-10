import { createContext, useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Uygulama ilk açıldığında token varsa kullanıcıyı doğrula
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const { data } = await api.get('/api/auth/me');
          setUser(data);
        } catch (error) {
          // Token geçersizse temizle
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/api/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    setUser(data);
    toast.success('Giriş başarılı.', {
      style: { borderRadius: '0', background: '#111', color: '#fff', border: '1px solid #333' },
      iconTheme: { primary: '#fff', secondary: '#111' }
    });
  };

  const register = async (name, email, password) => {
    const { data } = await api.post('/api/auth/register', { name, email, password });
    localStorage.setItem('token', data.token);
    setUser(data);
    toast.success('Kayıt başarılı.', {
      style: { borderRadius: '0', background: '#111', color: '#fff', border: '1px solid #333' },
      iconTheme: { primary: '#fff', secondary: '#111' }
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast('Çıkış yapıldı.', {
      style: { borderRadius: '0', background: '#111', color: '#fff', border: '1px solid #333' },
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
