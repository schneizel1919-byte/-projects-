import TrackItem from './TrackItem';

const TrackList = ({ tracks, currentTrack, isPlaying, isOwner, onPlayToggle, onDeleteTrack }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '40px' }}>
      {tracks.length === 0 ? (
        <p style={{ color: 'gray' }}>Bu projede henüz şarkı yok.</p>
      ) : (
        tracks.map((track, index) => {
          const isActive = currentTrack && currentTrack._id === track._id;
          return (
            <TrackItem
              key={track._id}
              track={track}
              index={index}
              isActive={isActive}
              isPlaying={isPlaying}
              isOwner={isOwner}
              onPlayToggle={() => onPlayToggle(track, isActive)}
              onDelete={onDeleteTrack}
            />
          );
        })
      )}
    </div>
  );
};

export default TrackList;
