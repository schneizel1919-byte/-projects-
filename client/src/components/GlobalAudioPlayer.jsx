import { useContext, useEffect, useRef, useState } from 'react';
import { PlayerContext } from '../context/PlayerContext';
import { AuthContext } from '../context/AuthContext';

const GlobalAudioPlayer = () => {
  const { currentTrack, isPlaying, projectInfo, togglePlay, playNext, playPrev, clearPlayer } = useContext(PlayerContext);
  const { user } = useContext(AuthContext);
  const audioRef = useRef(null);
  
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    // Kullanıcı çıkış yaparsa (user null olursa) oynatıcıyı temizle
    if (!user) {
      clearPlayer();
    }
  }, [user]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log('Autoplay engellendi:', e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  const handleSeek = (e) => {
    const time = Number(e.target.value);
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  if (!currentTrack) return null;

  // ---------- MİNİ PLAYER (ALT BAR) ----------
  if (!isFullScreen) {
    return (
      <div 
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          background: 'var(--bg-color)', borderTop: '1px solid var(--gray-border)',
          padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          zIndex: 1000, cursor: 'pointer', transition: 'background 0.2s'
        }}
        onClick={() => setIsFullScreen(true)}
      >
        {/* Sol: Kapak ve Şarkı Adı */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '30%' }}>
          {projectInfo?.coverImageUrl ? (
             <img src={projectInfo.coverImageUrl} alt="cover" style={{ width: '48px', height: '48px', objectFit: 'cover', border: '1px solid var(--gray-border)' }} />
          ) : (
             <div style={{ width: '48px', height: '48px', backgroundColor: 'var(--gray-light)', border: '1px solid var(--gray-border)' }}></div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '14px', fontWeight: '600' }}>{currentTrack.title}</span>
            <span style={{ fontSize: '12px', color: 'gray' }}>{projectInfo?.artist?.name || '[projects]'}</span>
          </div>
        </div>

        {/* Orta: Kontroller ve Bar */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '40%' }} onClick={e => e.stopPropagation()}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '8px' }}>
            <button onClick={playPrev} style={{ fontSize: '18px', color: 'var(--text-color)' }}>⏮</button>
            <button 
              onClick={togglePlay}
              className="btn-primary"
              style={{ width: '40px', height: '40px', borderRadius: '50%', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}
            >
              {isPlaying ? 'II' : '►'}
            </button>
            <button onClick={playNext} style={{ fontSize: '18px', color: 'var(--text-color)' }}>⏭</button>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '8px' }}>
             <span style={{ fontSize: '11px', color: 'gray', minWidth: '35px', textAlign: 'right' }}>{formatTime(currentTime)}</span>
             <input 
               type="range" 
               min="0" 
               max={duration || 0} 
               value={currentTime} 
               onChange={handleSeek}
               style={{ flex: 1, height: '4px', cursor: 'pointer', accentColor: 'var(--accent)' }}
             />
             <span style={{ fontSize: '11px', color: 'gray', minWidth: '35px' }}>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Sağ: Büyütme Butonu */}
        <div style={{ width: '30%', textAlign: 'right' }}>
           <button onClick={(e) => { e.stopPropagation(); setIsFullScreen(true); }} style={{ color: 'gray', fontSize: '20px' }}>⛶</button>
        </div>

        <audio 
          ref={audioRef} 
          src={currentTrack.audioUrl} 
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={playNext} 
        />
      </div>
    );
  }

  // ---------- FULL SCREEN PLAYER ----------
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      zIndex: 2000, display: 'flex', flexDirection: 'column',
      color: 'white', overflow: 'hidden'
    }}>
      {/* Background (Bulanıklaştırılmış Kapak Resmi - Şık Gradyan Etkisi) */}
      <div style={{
        position: 'absolute', top: '-10%', left: '-10%', right: '-10%', bottom: '-10%',
        backgroundImage: projectInfo?.coverImageUrl ? `url(${projectInfo.coverImageUrl})` : 'none', 
        backgroundColor: '#111',
        backgroundSize: 'cover', backgroundPosition: 'center',
        filter: 'blur(80px) brightness(0.4)', zIndex: -1
      }}></div>

      {/* Üst Bar */}
      <div style={{ padding: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
         <button onClick={() => setIsFullScreen(false)} style={{ color: 'white', fontSize: '32px', lineHeight: '1' }}>⌄</button>
         <span style={{ fontSize: '14px', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', fontWeight: '600' }}>
            Şu An Çalıyor
         </span>
         <div style={{ width: '32px' }}></div>
      </div>

      {/* Ana İçerik */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 40px' }}>
         {/* Kapak Görseli */}
         {projectInfo?.coverImageUrl ? (
            <img 
              src={projectInfo.coverImageUrl} 
              alt="cover" 
              style={{ width: '100%', maxWidth: '360px', aspectRatio: '1/1', objectFit: 'cover', borderRadius: '4px', boxShadow: '0 20px 50px rgba(0,0,0,0.6)', marginBottom: '48px' }} 
            />
         ) : (
            <div style={{ width: '100%', maxWidth: '360px', aspectRatio: '1/1', backgroundColor: '#333', marginBottom: '48px' }}></div>
         )}

         {/* Şarkı ve Sanatçı Bilgisi */}
         <div style={{ width: '100%', maxWidth: '400px' }}>
           <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px', letterSpacing: '-1px' }}>{currentTrack.title}</h2>
           <h3 style={{ fontSize: '18px', color: 'rgba(255,255,255,0.7)', marginBottom: '32px' }}>{projectInfo?.artist?.name} — {projectInfo?.title}</h3>

           {/* Progress Bar */}
           <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '16px', marginBottom: '40px' }}>
             <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', minWidth: '40px' }}>{formatTime(currentTime)}</span>
             <input 
               type="range" 
               min="0" 
               max={duration || 0} 
               value={currentTime} 
               onChange={handleSeek}
               style={{ flex: 1, height: '4px', cursor: 'pointer', accentColor: 'white' }}
             />
             <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', minWidth: '40px', textAlign: 'right' }}>{formatTime(duration)}</span>
          </div>

          {/* Kontroller */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '40px' }}>
            <button onClick={playPrev} style={{ fontSize: '32px', color: 'white', transition: 'opacity 0.2s' }} onMouseOver={e=>e.target.style.opacity='0.7'} onMouseOut={e=>e.target.style.opacity='1'}>⏮</button>
            <button 
              onClick={togglePlay}
              style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'white', color: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', transition: 'transform 0.1s' }}
              onMouseDown={e=>e.target.style.transform='scale(0.95)'}
              onMouseUp={e=>e.target.style.transform='scale(1)'}
            >
              {isPlaying ? 'II' : '►'}
            </button>
            <button onClick={playNext} style={{ fontSize: '32px', color: 'white', transition: 'opacity 0.2s' }} onMouseOver={e=>e.target.style.opacity='0.7'} onMouseOut={e=>e.target.style.opacity='1'}>⏭</button>
          </div>
         </div>
      </div>

      <audio 
        ref={audioRef} 
        src={currentTrack.audioUrl} 
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={playNext} 
      />
    </div>
  );
};

export default GlobalAudioPlayer;
