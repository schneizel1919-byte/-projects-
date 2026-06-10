
const TrackItem = ({ track, index, isActive, isPlaying, isOwner, onPlayToggle, onDelete }) => {
  return (
    <div 
      style={{ 
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
        padding: '16px', background: isActive ? 'var(--gray-light)' : 'transparent',
        border: '1px solid var(--gray-border)', transition: 'background 0.2s'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span style={{ color: 'gray', width: '24px', fontSize: '14px' }}>{index + 1}</span>
        <button 
          onClick={onPlayToggle}
          className="btn-primary" 
          style={{ padding: '8px', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}
        >
          {isActive && isPlaying ? 'II' : '►'}
        </button>
        <span style={{ fontWeight: isActive ? '600' : '500', fontSize: '15px' }}>{track.title}</span>
      </div>
      
      {isOwner && (
        <button onClick={() => onDelete(track._id)} style={{ color: '#FF3333', fontSize: '12px', fontWeight: '700' }}>SİL</button>
      )}
    </div>
  );
};

export default TrackItem;
