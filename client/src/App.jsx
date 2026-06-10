import { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import GlobalAudioPlayer from './components/GlobalAudioPlayer';
import { PlayerContext } from './context/PlayerContext';

import HomePage from './pages/HomePage';
import ProjectPage from './pages/ProjectPage';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';

import Footer from './components/Footer';

function App() {
  const { currentTrack } = useContext(PlayerContext);

  return (
    <div style={{ paddingBottom: currentTrack ? '90px' : '0', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main className="container" style={{ paddingTop: '60px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/project/:id" element={<ProjectPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </main>
      <Footer />
      <GlobalAudioPlayer />
    </div>
  );
}

export default App;
