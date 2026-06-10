export const formatUrl = (url) => {
  if (!url) return url;
  if (url.includes('localhost:5000')) {
    // Vite ortamında tanımlı olan backend adresimiz
    return url.replace('http://localhost:5000', import.meta.env.VITE_API_URL);
  }
  return url;
};
