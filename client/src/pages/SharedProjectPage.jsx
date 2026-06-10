import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { PlayerContext } from '../context/PlayerContext';
import toast from 'react-hot-toast';

const SharedProjectPage = () => {
  const { token } = useParams();
  const { user } = useContext(AuthContext);
  const { playTrack, currentTrack, isPlaying, togglePlay } = useContext(PlayerContext);
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cloning, setCloning] = useState(false);

  useEffect(() => {
    api.get(`/api/projects/shared/${token}`)
      .then(({ data }) => setProject(data))
      .catch(() => toast.error('Proje bulunamadı veya link geçersiz.'))
      .finally(() => setLoading(false));
  }, [token]);

  const handleClone = async () => {
    if (!user) { toast.error('Kütüphanene eklemek için giriş yapmalısın!'); navigate('/auth'); return; }
    setCloning(true);
    try {
      await api.post(`/api/projects/shared/${token}/clone`);
      toast.success('Proje kütüphanene eklendi! 🎉');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Bir hata oluştu.');
    } finally { setCloning(false); }
  };

  if (loading) return <div className="spinner" style={{ margin: '100px auto' }}></div>;
  if (!project) return <div style={{ textAlign: 'center', marginTop: '100px', color: 'gray' }}>Proje bulunamadı.</div>;

  const isOwner = user && project.artist && user._id === project.artist._id;

  return (
    <div>
      {/* Paylaşım Bandı */}
      <div style={{ background: 'var(--accent)', padding: '12px 24px', borderRadius: '8px', marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: '600', fontSize: '14px', color: '#000' }}>
          🔗 <strong>{project.artist?.name}</strong> bu projeyi seninle paylaştı!
        </span>
        {!isOwner && (
          <button onClick={handleClone} disabled={cloning} className="btn-primary"
            style={{ background: '#000', color: '#fff', padding: '8px 20px', fontSize: '14px' }}>
            {cloning ? 'Ekleniyor...' : '+ Kütüphaneme Ekle'}
          </button>
        )}
        {isOwner && <span style={{ fontSize: '13px', color: '#000', fontStyle: 'italic' }}>Bu senin projen.</span>}
      </div>

      {/* Proje Başlık */}
      <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start', flexWrap: 'wrap', marginBottom: '48px' }}>
        <div style={{
          width: '260px', height: '260px', backgroundColor: 'var(--gray-light)',
          backgroundImage: project.coverImageUrl ? `url(${project.coverImageUrl})` : 'none',
          backgroundSize: 'cover', backgroundPosition: 'center', border: '1px solid var(--gray-border)'
        }} />
        <div style={{ flex: 1, paddingTop: '16px' }}>
          <h1 style={{ fontSize: '48px', fontWeight: '700', letterSpacing: '-2px', marginBottom: '8px' }}>{project.title}</h1>
          <h2 style={{ fontSize: '18px', color: 'gray', marginBottom: '16px', fontWeight: '500' }}>{project.artist?.name}</h2>
          <p style={{ fontSize: '15px', lineHeight: '1.6', maxWidth: '600px' }}>{project.description}</p>
          <p style={{ marginTop: '16px', color: 'gray', fontSize: '14px' }}>{project.tracks?.length || 0} şarkı</p>
        </div>
      </div>

      {/* Şarkı Listesi */}
      <h3 style={{ fontSize: '22px', letterSpacing: '-0.5px', marginBottom: '16px', borderBottom: '1px solid var(--gray-border)', paddingBottom: '12px' }}>Şarkı Listesi</h3>
      {project.tracks?.length === 0 ? (
        <p style={{ color: 'gray' }}>Bu projede henüz şarkı yok.</p>
      ) : (
        project.tracks.map((track, i) => {
          const isActive = currentTrack && currentTrack._id === track._id;
          return (
            <div key={track._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', border: '1px solid var(--gray-border)', borderRadius: '6px', marginBottom: '8px', backgroundColor: isActive ? 'var(--gray-light)' : 'transparent', cursor: 'pointer' }}
              onClick={() => isActive ? togglePlay() : playTrack(track, project.tracks, project)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ color: 'gray', fontSize: '13px', width: '20px' }}>{isActive && isPlaying ? '▶' : i + 1}</span>
                <span style={{ fontWeight: isActive ? '600' : '400' }}>{track.title}</span>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default SharedProjectPage;
