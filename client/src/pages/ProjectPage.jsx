import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { PlayerContext } from '../context/PlayerContext';
import TrackList from '../components/TrackList';
import { formatUrl } from '../utils/formatUrl';

const ProjectPage = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const { playTrack, currentTrack, isPlaying, togglePlay } = useContext(PlayerContext);

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trackForm, setTrackForm] = useState({ title: '' });
  const [audioFile, setAudioFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showTrackForm, setShowTrackForm] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data } = await api.get(`/api/projects/${id}`);
        setProject(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  const handleAddTrack = async (e) => {
    e.preventDefault();
    if (!audioFile) {
      alert("Lütfen bilgisayarınızdan bir ses dosyası seçin.");
      return;
    }

    setIsUploading(true);
    try {
      // 1. Önce ses dosyasını /api/upload'a gönder
      const uploadData = new FormData();
      uploadData.append('file', audioFile);

      const uploadRes = await api.post('/api/upload', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const finalAudioUrl = uploadRes.data.url;

      // 2. Yüklenen dosyanın URL'i ile Track oluştur
      const { data } = await api.post('/api/tracks', {
        title: trackForm.title,
        audioUrl: finalAudioUrl,
        projectId: id
      });

      setProject({ ...project, tracks: [...project.tracks, data] });
      setTrackForm({ title: '' });
      setAudioFile(null);
      setShowTrackForm(false);

      // Form input file değerini sıfırlamak için DOM kullanabiliriz ama basit geçelim
      document.getElementById('audioInput').value = '';
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteTrack = async (trackId) => {
    if (!window.confirm("Bu şarkıyı silmek istediğinize emin misiniz?")) return;
    try {
      await api.delete(`/api/tracks/${trackId}`);
      setProject({ ...project, tracks: project.tracks.filter(t => t._id !== trackId) });
    } catch (error) { }
  };

  const handleDeleteProject = async () => {
    if (!window.confirm("Bu projeyi tamamen silmek istediğinize emin misiniz?")) return;
    try {
      await api.delete(`/api/projects/${id}`);
      navigate('/');
    } catch (error) { }
  };

  if (loading) return <div className="spinner" style={{ margin: '100px auto' }}></div>;
  if (!project) return <div style={{ textAlign: 'center', marginTop: '100px', color: 'gray' }}>Proje bulunamadı.</div>;

  const isOwner = user && project.artist && user._id === project.artist._id;

  return (
    <div>
      {/* Üst Kısım: Proje Kapak ve Bilgiler */}
      <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start', flexWrap: 'wrap', marginBottom: '64px' }}>
        <div style={{
          width: '300px', height: '300px',
          backgroundColor: 'var(--gray-light)',
          backgroundImage: project.coverImageUrl ? `url(${formatUrl(project.coverImageUrl)})` : 'none',
          backgroundSize: 'cover', backgroundPosition: 'center',
          border: '1px solid var(--gray-border)'
        }}></div>

        <div style={{ flex: 1, minWidth: '300px', paddingTop: '20px', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <h1 style={{ fontSize: '56px', letterSpacing: '-2px', fontWeight: '700', marginBottom: '8px', lineHeight: '1.1' }}>
              {project.title}
            </h1>

            {/* 3 Nokta Menüsü (Sadece Proje Sahibine Görünür) */}
            {isOwner && (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  style={{ background: 'transparent', color: 'var(--text-color)', border: 'none', fontSize: '24px', cursor: 'pointer', padding: '8px 16px', borderRadius: '4px' }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--gray-light)'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  ⋮
                </button>

                {showMenu && (
                  <div style={{ position: 'absolute', right: 0, top: '40px', backgroundColor: 'var(--bg-color)', border: '1px solid var(--gray-border)', borderRadius: '8px', boxShadow: '0 4px 12px rgba(255, 255, 255, 1)', zIndex: 10, minWidth: '150px', overflow: 'hidden' }}>
                    <button
                      onClick={() => {
                        const link = `${window.location.origin}/shared/${project.shareToken}`;
                        navigator.clipboard.writeText(link);
                        import('react-hot-toast').then(m => m.default.success('Paylaşım linki kopyalandı.'));
                        setShowMenu(false);
                      }}
                      style={{ display: 'block', width: '100%', padding: '12px 16px', textAlign: 'left', background: 'transparent', border: 'none', borderBottom: '1px solid var(--gray-border)', cursor: 'pointer', fontSize: '14px', fontWeight: '500', color: 'white' }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--gray-light)'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      Paylaş
                    </button>
                    <button
                      onClick={handleDeleteProject}
                      style={{ display: 'block', width: '100%', padding: '12px 16px', textAlign: 'left', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '500', color: 'white' }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--gray-light)'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      Sil
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <h2 style={{ fontSize: '20px', color: 'gray', marginBottom: '24px', fontWeight: '500' }}>
            {project.artist?.name || 'Bilinmeyen Sanatçı'}
          </h2>
          <p style={{ fontSize: '15px', lineHeight: '1.6', maxWidth: '600px' }}>{project.description}</p>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--gray-border)', paddingBottom: '16px' }}>
        <h3 style={{ fontSize: '24px', letterSpacing: '-0.5px' }}>Şarkı Listesi</h3>
        {isOwner && (
          <button onClick={() => setShowTrackForm(!showTrackForm)} className="btn-primary" style={{ padding: '8px 16px', fontSize: '14px' }}>
            {showTrackForm ? 'İptal' : 'Yeni Şarkı Ekle'}
          </button>
        )}
      </div>

      {/* Şarkı Ekleme Formu (Gizlenebilir) */}
      {isOwner && showTrackForm && (
        <form onSubmit={handleAddTrack} style={{ padding: '32px', border: '1px solid var(--gray-border)', marginBottom: '32px', backgroundColor: 'var(--gray-light)' }}>
          <h4 style={{ fontSize: '18px', marginBottom: '16px', fontWeight: '600' }}>Bilgisayardan Yeni Şarkı Ekle</h4>

          <input className="input-field" style={{ backgroundColor: 'var(--bg-color)' }} type="text" placeholder="Şarkı Adı" value={trackForm.title} onChange={e => setTrackForm({ ...trackForm, title: e.target.value })} required />

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', fontWeight: '500' }}>Ses Dosyası Seç (.mp3, .wav)</label>
            <input id="audioInput" className="input-field" style={{ backgroundColor: 'var(--bg-color)', padding: '8px' }} type="file" accept="audio/*" onChange={e => setAudioFile(e.target.files[0])} required />
          </div>

          <button type="submit" className="btn-primary" disabled={isUploading}>
            {isUploading ? 'Dosya Yükleniyor...' : 'Şarkıyı Yükle'}
          </button>
        </form>
      )}

      {/* Alt Kısım: Şarkılar */}
      <TrackList
        tracks={project.tracks}
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        isOwner={isOwner}
        onPlayToggle={(track, isActive) => isActive ? togglePlay() : playTrack(track, project.tracks, project)}
        onDeleteTrack={handleDeleteTrack}
      />
    </div>
  );
};

export default ProjectPage;
