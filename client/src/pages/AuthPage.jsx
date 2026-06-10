import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Spinner from '../components/Spinner';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState('');
  const { login, register } = useContext(AuthContext);
  const navigate = useNavigate();

  const validateForm = () => {
    setValidationError('');
    const emailRegex = /^\S+@\S+\.\S+$/;
    
    if (!emailRegex.test(formData.email)) {
      setValidationError('Geçerli bir e-posta adresi giriniz.');
      return false;
    }
    
    if (formData.password.length < 6) {
      setValidationError('Şifre en az 6 karakter olmalıdır.');
      return false;
    }
    
    if (!isLogin && formData.name.trim().length === 0) {
      setValidationError('İsim alanı boş bırakılamaz.');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.name, formData.email, formData.password);
      }
      navigate('/'); // Başarılıysa ana sayfaya at
    } catch (error) {
      // Axios interceptor zaten toast mesajını gösteriyor
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '80px auto 0' }}>
      <h1 style={{ fontSize: '32px', marginBottom: '8px', letterSpacing: '-1px' }}>
        {isLogin ? 'Giriş Yap.' : 'Kayıt Ol.'}
      </h1>
      <p style={{ color: 'gray', fontSize: '14px', marginBottom: '24px' }}>
        [projects] platformuna hoş geldin.
      </p>

      {validationError && (
        <div style={{ padding: '12px', backgroundColor: '#fee', color: '#e74c3c', border: '1px solid #fcc', marginBottom: '16px', fontSize: '14px' }}>
          {validationError}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
        {!isLogin && (
          <input
            className="input-field"
            type="text"
            placeholder="İsim"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        )}
        <input
          className="input-field"
          type="email"
          placeholder="E-posta"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <input
          className="input-field"
          type="password"
          placeholder="Şifre"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
        
        <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '8px', minHeight: '44px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {loading ? <Spinner size={20} color="var(--bg-color)" /> : (isLogin ? 'Giriş' : 'Kayıt')}
        </button>
      </form>

      <div style={{ marginTop: '24px', textAlign: 'center' }}>
        <button 
          type="button"
          onClick={() => {
            setIsLogin(!isLogin);
            setValidationError('');
          }} 
          style={{ color: 'gray', fontSize: '14px', textDecoration: 'underline' }}
        >
          {isLogin ? 'Hesabın yok mu? Kayıt ol.' : 'Zaten hesabın var mı? Giriş yap.'}
        </button>
      </div>
    </div>
  );
};

export default AuthPage;
