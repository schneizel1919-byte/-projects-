import { createContext, useState } from 'react';

export const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [trackList, setTrackList] = useState([]);
  const [projectInfo, setProjectInfo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Yeni bir şarkı başlat
  const playTrack = (track, list = [], project = null) => {
    setCurrentTrack(track);
    if (list.length > 0) setTrackList(list);
    if (project) setProjectInfo(project);
    setIsPlaying(true);
  };

  // Çalan şarkıyı durdur veya duran şarkıyı başlat
  const togglePlay = () => {
    if (currentTrack) {
      setIsPlaying((prev) => !prev);
    }
  };

  const playNext = () => {
    if (!currentTrack || trackList.length === 0) return;
    const currentIndex = trackList.findIndex(t => t._id === currentTrack._id);
    if (currentIndex < trackList.length - 1) {
      setCurrentTrack(trackList[currentIndex + 1]);
      setIsPlaying(true);
    }
  };

  const playPrev = () => {
    if (!currentTrack || trackList.length === 0) return;
    const currentIndex = trackList.findIndex(t => t._id === currentTrack._id);
    if (currentIndex > 0) {
      setCurrentTrack(trackList[currentIndex - 1]);
      setIsPlaying(true);
    }
  };

  const clearPlayer = () => {
    setCurrentTrack(null);
    setTrackList([]);
    setProjectInfo(null);
    setIsPlaying(false);
  };

  return (
    <PlayerContext.Provider value={{ currentTrack, isPlaying, trackList, projectInfo, playTrack, togglePlay, playNext, playPrev, clearPlayer }}>
      {children}
    </PlayerContext.Provider>
  );
};
