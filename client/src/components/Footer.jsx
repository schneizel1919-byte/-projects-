const Footer = () => {
  return (
    <footer style={{
      textAlign: 'center',
      padding: '24px',
      marginTop: 'auto',
      borderTop: '1px solid var(--gray-border)',
      color: 'gray',
      fontSize: '12px'
    }}>
      <p>&copy; {new Date().getFullYear()} [projects] Platform. Tüm hakları saklıdır.</p>
    </footer>
  );
};

export default Footer;
