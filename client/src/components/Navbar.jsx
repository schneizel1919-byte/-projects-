import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={{ borderBottom: '1px solid var(--gray-border)', padding: '24px 0' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ fontSize: '24px', fontWeight: '700', letterSpacing: '-1px' }}>
          [projects]
        </Link>
        
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          {user ? (
            <>
              <Link to="/profile" style={{ fontSize: '14px', fontWeight: '500' }}>Profil ({user.name})</Link>
              <button onClick={handleLogout} className="btn-outline" style={{ padding: '8px 16px' }}>Çıkış</button>
            </>
          ) : (
            <Link to="/auth" className="btn-primary">Giriş Yap</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
