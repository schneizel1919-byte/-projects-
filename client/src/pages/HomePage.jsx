import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { PlayerContext } from '../context/PlayerContext';
import ProjectCard from '../components/ProjectCard';
import Modal from '../components/Modal';

const HomePage = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const { playTrack, currentTrack, isPlaying, togglePlay } = useContext(PlayerContext);

  const [myProjects, setMyProjects] = useState([]);
  const [standaloneTracks, setStandaloneTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ekleme Menüsü
  const [showOptions, setShowOptions] = useState(false);
  const [formType, setFormType] = useState(null); // 'project' veya 'track'

  // Proje Form
  const [projectData, setProjectData] = useState({ title: '', description: '' });
  const [coverFile, setCoverFile] = useState(null);

  // Track Form
  const [trackForm, setTrackForm] = useState({ title: '' });
  const [audioFile, setAudioFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (user) {
      const fetchMyLibrary = async () => {
        try {
          const { data } = await api.get(`/api/users/${user._id}/projects`);
          setMyProjects(data.projects || []);
          setStandaloneTracks(data.standaloneTracks || []);
        } catch (error) {
          console.error("Projeler yüklenemedi", error);
        } finally {
          setLoading(false);
        }
      };
      fetchMyLibrary();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (authLoading || loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  // Giriş YAPMAMIŞ kullanıcılar için karşılama sayfası
  if (!user) {
    return (
      <div style={{ textAlign: 'center', marginTop: '120px' }}>
        <h1 style={{ fontSize: '56px', letterSpacing: '-2px', fontWeight: '700', marginBottom: '24px' }}>
          Müzik Kütüphanene Hoş Geldin.
        </h1>
        <p style={{ color: 'gray', fontSize: '18px', maxWidth: '600px', margin: '0 auto 48px', lineHeight: '1.6' }}>
          [projects], kendi müzik demolarını güvenle yükleyebileceğin, saklayabileceğin ve sadece istediğin kişilerle bağlantı aracılığıyla paylaşabileceğin tamamen kişisel bir bulut alanıdır.
        </p>
        <Link to="/auth" className="btn-primary" style={{ padding: '16px 32px', fontSize: '18px', textDecoration: 'none' }}>
          Giriş Yap / Kayıt Ol
        </Link>
      </div>
    );
  }

  // ----------- GİRİŞ YAPMIŞ KULLANICI İÇİN İŞLEMLER -----------
  const handleCreateProject = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      let finalCoverUrl = '';
      if (coverFile) {
        const uploadData = new FormData();
        uploadData.append('file', coverFile);
        const uploadRes = await api.post('/api/upload', uploadData, { headers: { 'Content-Type': 'multipart/form-data' } });
        finalCoverUrl = uploadRes.data.url;
      }
      const { data } = await api.post('/api/projects', { ...projectData, coverImageUrl: finalCoverUrl });
      setMyProjects([data, ...myProjects]);
      setFormType(null);
      setShowOptions(false);
      setProjectData({ title: '', description: '' });
      setCoverFile(null);
    } catch (error) { } finally { setIsUploading(false); }
  };

  const handleUploadTrack = async (e) => {
    e.preventDefault();
    if (!audioFile) return alert("Ses dosyası seçin.");
    setIsUploading(true);
    try {
      const uploadData = new FormData();
      uploadData.append('file', audioFile);
      const uploadRes = await api.post('/api/upload', uploadData, { headers: { 'Content-Type': 'multipart/form-data' } });

      const { data } = await api.post('/api/tracks', { title: trackForm.title, audioUrl: uploadRes.data.url });
      setStandaloneTracks([data, ...standaloneTracks]);
      setFormType(null);
      setShowOptions(false);
      setTrackForm({ title: '' });
      setAudioFile(null);
    } catch (error) { } finally { setIsUploading(false); }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm("Bu klasörü tamamen silmek istediğinize emin misiniz?")) return;
    try {
      await api.delete(`/api/projects/${id}`);
      setMyProjects(myProjects.filter(p => p._id !== id));
    } catch (error) { }
  };

  const handleDeleteTrack = async (trackId) => {
    if (!window.confirm("Bu bağımsız şarkıyı silmek istediğinize emin misiniz?")) return;
    try {
      await api.delete(`/api/tracks/${trackId}`);
      setStandaloneTracks(standaloneTracks.filter(t => t._id !== trackId));
    } catch (error) { }
  };

  // Giriş YAPMIŞ kullanıcı için Kendi Kütüphanesi
  return (
    <div>
      {/* Üst Kısım: Başlık ve Dev Ekleme Butonu */}
      <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', paddingBottom: '20px', borderBottom: '1px solid var(--gray-border)' }}>
        <h1 style={{ fontSize: '40px', letterSpacing: '-1.5px', fontWeight: '700', margin: 0, textAlign: 'left' }}>Kütüphanem.</h1>

        <div style={{ position: 'relative' }}>
          <button
            onClick={() => { setShowOptions(!showOptions); setFormType(null); }}
            style={{
              background: 'white', color: 'black', padding: '16px 32px',
              fontSize: '18px', fontWeight: '700', borderRadius: '40px',
              border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
              boxShadow: '0 4px 15px rgba(255,255,255,0.2)', transition: 'transform 0.1s'
            }}
            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <span style={{ fontSize: '24px', lineHeight: '1' }}>{showOptions ? '×' : '+'}</span>
          </button>

          {/* Seçenekler Menüsü */}
          {showOptions && !formType && (
            <div style={{
              position: 'absolute', top: '70px', right: '0',
              background: 'var(--gray-light)', border: '1px solid var(--gray-border)',
              borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', zIndex: 10, width: '250px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.8)'
            }}>
              <button
                onClick={() => setFormType('project')}
                style={{ background: 'transparent', border: '1px solid gray', color: 'white', padding: '12px', textAlign: 'left', fontWeight: '600', cursor: 'pointer' }}
              >
                Yeni Klasör Oluştur
              </button>
              <button
                onClick={() => setFormType('track')}
                style={{ background: 'transparent', border: '1px solid gray', color: 'white', padding: '12px', textAlign: 'left', fontWeight: '600', cursor: 'pointer' }}
              >
                Yeni Proje Ekle
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Dinamik Form Alanları (Modal içinde) */}
      <Modal isOpen={formType === 'project'} onClose={() => setFormType(null)} title="Yeni Klasör Oluştur">
        <form onSubmit={handleCreateProject} style={{ padding: '8px' }}>
          <input className="input-field" style={{ background: 'var(--bg-color)' }} type="text" placeholder="Klasör Adı (Zorunlu)" value={projectData.title} onChange={e => setProjectData({ ...projectData, title: e.target.value })} required />
          <input className="input-field" style={{ background: 'var(--bg-color)' }} type="text" placeholder="Açıklama" value={projectData.description} onChange={e => setProjectData({ ...projectData, description: e.target.value })} />
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px' }}>Kapak Resmi Yükle</label>
            <input className="input-field" style={{ padding: '8px', background: 'var(--bg-color)' }} type="file" accept="image/*" onChange={e => setCoverFile(e.target.files[0])} />
          </div>
          <button type="submit" className="btn-primary" disabled={isUploading}>{isUploading ? 'Yükleniyor...' : 'Klasörü Oluştur'}</button>
        </form>
      </Modal>

      <Modal isOpen={formType === 'track'} onClose={() => setFormType(null)} title="Bağımsız Şarkı Yükle">
        <form onSubmit={handleUploadTrack} style={{ padding: '8px' }}>
          <p style={{ color: 'gray', fontSize: '14px', marginBottom: '16px' }}>Bu şarkı hiçbir klasöre ait olmayacak, doğrudan kütüphanende görünecektir.</p>
          <input className="input-field" style={{ background: 'var(--bg-color)' }} type="text" placeholder="Şarkı Adı (Zorunlu)" value={trackForm.title} onChange={e => setTrackForm({ ...trackForm, title: e.target.value })} required />
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px' }}>Ses Dosyası Seç (.mp3, .wav)</label>
            <input className="input-field" style={{ padding: '8px', background: 'var(--bg-color)' }} type="file" accept="audio/*" onChange={e => setAudioFile(e.target.files[0])} required />
          </div>
          <button type="submit" className="btn-primary" disabled={isUploading}>{isUploading ? 'Yükleniyor...' : 'Şarkıyı Yükle'}</button>
        </form>
      </Modal>

      {/* BAĞIMSIZ ŞARKILAR (SINGLE) LISTESİ */}
      {standaloneTracks.length > 0 && (
        <div style={{ marginBottom: '64px' }}>
          <h2 style={{ fontSize: '24px', letterSpacing: '-0.5px', marginBottom: '24px', color: 'white' }}>Bağımsız Şarkılar</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {standaloneTracks.map((track, index) => {
              const isActive = currentTrack && currentTrack._id === track._id;
              return (
                <div key={track._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: isActive ? 'var(--gray-light)' : 'transparent', border: '1px solid var(--gray-border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ color: 'gray', width: '24px', fontSize: '14px' }}>{index + 1}</span>
                    <button onClick={() => isActive ? togglePlay() : playTrack(track, standaloneTracks)} className="btn-primary" style={{ padding: '8px', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {isActive && isPlaying ? 'II' : '►'}
                    </button>
                    <span style={{ fontWeight: isActive ? '600' : '500' }}>{track.title}</span>
                  </div>
                  <button onClick={() => handleDeleteTrack(track._id)} style={{ color: '#FF3333', fontSize: '12px', fontWeight: '700' }}>SİL</button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* KLASÖRLER (PROJELER) LİSTESİ */}
      <h2 style={{ fontSize: '24px', letterSpacing: '-0.5px', marginBottom: '24px', color: 'white' }}>Projelerim.</h2>
      {myProjects.length === 0 ? (
        <p style={{ color: 'gray' }}>Henüz bir proje oluşturmadın.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: '40px 24px' }}>
          {myProjects.map((project) => (
            <div key={project._id} style={{ position: 'relative' }}>
              <ProjectCard project={project} />
              <button
                onClick={() => handleDeleteProject(project._id)}
                style={{ position: 'absolute', top: '10px', right: '10px', background: '#FF3333', color: 'white', padding: '6px 12px', fontSize: '12px', fontWeight: 'bold' }}
              >
                SİL
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
