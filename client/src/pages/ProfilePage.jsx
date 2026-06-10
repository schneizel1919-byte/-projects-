import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const ProfilePage = () => {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', paddingTop: '40px' }}>
      <h1 style={{ fontSize: '32px', marginBottom: '24px' }}>Profil Ayarları</h1>

      <div style={{ background: 'var(--gray-light)', padding: '24px', border: '1px solid var(--gray-border)', borderRadius: '8px' }}>
        <p style={{ marginBottom: '16px', fontSize: '18px' }}><strong>İsim:</strong> {user.name}</p>
        <p style={{ marginBottom: '16px', fontSize: '18px' }}><strong>E-posta:</strong> {user.email}</p>
      </div>
    </div>
  );
};

export default ProfilePage;
