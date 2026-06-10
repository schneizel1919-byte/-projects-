const Spinner = ({ size = 24, color = '#fff' }) => {
  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        border: `3px solid rgba(255, 255, 255, 0.1)`,
        borderTopColor: color,
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto',
      }}
    />
  );
};

export default Spinner;
