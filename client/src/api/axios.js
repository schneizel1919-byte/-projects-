import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
});

// İstek (Request) Interceptor: Token'ı header'a ekle
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      if (typeof config.headers.set === 'function') {
        config.headers.set('Authorization', `Bearer ${token}`);
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Cevap (Response) Interceptor: Hataları yakala ve toast ile göster
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Backend'den gelen özel hata mesajını al, yoksa genel bir mesaj göster
    const message = error.response?.data?.message || 'Bir hata oluştu.';
    
    // Minimalist, keskin hatlı siyah/beyaz toast tasarımı
    toast.error(message, {
      style: {
        borderRadius: '0',
        background: '#111',
        color: '#fff',
        border: '1px solid #333',
        fontSize: '14px',
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#111',
      },
    });

    return Promise.reject(error);
  }
);

export default api;
