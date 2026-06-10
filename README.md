# [projects] — Kişisel Müzik Kütüphanesi ve Paylaşım Platformu

> Kendi müzik demolarını güvenle yükle, klasörlerinde düzenle ve özel link ile istediğin kişiyle paylaş.

---

## 📸 Ekran Görüntüleri

| Ana Sayfa (Kütüphane) | Proje Detay Sayfası |
|---|---|
| ![Ana Sayfa](docs/screenshots/homepage.png) | ![Proje Sayfası](docs/screenshots/projectpage.png) |

| Paylaşılan Proje (Misafir Görünümü) | Giriş / Kayıt |
|---|---|
| ![Paylaşım](docs/screenshots/shared.png) | ![Auth](docs/screenshots/auth.png) |

---

## 🚀 Canlı Demo

- **Frontend:** [https://projects-music.vercel.app](https://projects-music.vercel.app)
- **Backend API:** [https://projects-backend.onrender.com](https://projects-backend.onrender.com)

---

## 🛠️ Kullanılan Teknolojiler

### Frontend
| Teknoloji | Sürüm | Açıklama |
|---|---|---|
| React.js | ^19.2 | Kullanıcı arayüzü |
| React Router DOM | ^7.15 | Sayfa yönlendirme |
| Axios | ^1.16 | HTTP istemcisi (Interceptor ile JWT entegrasyonu) |
| Context API | — | Global state yönetimi (Auth & Player) |
| Vite | ^8.0 | Build ve geliştirme aracı |

### Backend
| Teknoloji | Sürüm | Açıklama |
|---|---|---|
| Node.js | ≥18 | Sunucu ortamı |
| Express.js | ^4.x | REST API çatısı |
| MongoDB + Mongoose | ^8.x | NoSQL veritabanı ve ODM |
| JSON Web Token (JWT) | ^9.x | Kimlik doğrulama |
| Bcrypt.js | ^2.x | Şifre hashleme |
| Multer | ^1.x | Dosya yükleme middleware |
| Crypto (Node built-in) | — | Paylaşım token üretimi |

### Dağıtım (Deployment)
| Servis | Kullanım |
|---|---|
| **Vercel** | React Frontend |
| **Render** | Node.js Backend |
| **MongoDB Atlas** | Bulut Veritabanı |

---

## ✨ Temel Özellikler

- 🔐 **JWT Tabanlı Güvenli Kimlik Doğrulama** — Bcrypt ile şifrelenmiş kullanıcı kayıt/giriş sistemi
- 📁 **Proje (Klasör) Yönetimi** — Kapak resimli klasörler oluştur, içlerine şarkı ekle
- 🎵 **Single (Tekli) Şarkı Yükleme** — Tek şarkılar otomatik olarak "Single Proje" yapısına dönüştürülür
- 🔗 **Özel Link ile Paylaşım** — `crypto` modülü ile üretilen tahmin edilemez share token sayesinde yalnızca link sahipleri projeye ulaşır
- 📥 **Kütüphaneye Ekleme (Klonlama)** — Link sahibi, projeyi tek tuşla kendi kütüphanesine kopyalayabilir
- 📂 **Klasöre Taşıma** — Bir projedeki şarkıları başka bir projeye taşı, boşalan klasör otomatik silinir
- ▶️ **Global Audio Player** — Spotify benzeri kesintisiz müzik çalar; sayfalar arası geçişte müzik durmaz

---

## 📁 Proje Yapısı

```
├── controllers/          # İş mantığı (Auth, Project, Track, User)
├── middleware/           # JWT doğrulama middleware
├── models/               # Mongoose şemaları (User, Project, Track)
├── routes/               # Express API rotaları
├── uploads/              # Yüklenen dosyalar (local geliştirme)
├── server.js             # Uygulama giriş noktası
├── .env.example          # Ortam değişkeni şablonu
│
└── client/               # React Frontend (Vite)
    ├── src/
    │   ├── api/          # Axios instance ve interceptor
    │   ├── components/   # Tekrar kullanılabilir bileşenler
    │   ├── context/      # AuthContext, PlayerContext
    │   ├── pages/        # Sayfa bileşenleri
    │   └── utils/        # Yardımcı fonksiyonlar (formatUrl)
    └── vercel.json       # Vercel SPA yönlendirme ayarı
```

---

## ⚙️ Kurulum ve Çalıştırma

### Gereksinimler
- Node.js v18 veya üzeri
- MongoDB (Atlas veya yerel kurulum)

### 1. Depoyu Klonla

```bash
git clone https://github.com/schneizel1919-byte/-projects-.git
cd -projects-
```

### 2. Backend Kurulumu

```bash
# Bağımlılıkları yükle
npm install

# .env.example dosyasını kopyala ve doldur
cp .env.example .env
```

`.env` dosyasını düzenle:
```env
PORT=5000
MONGODB_URI=<MongoDB bağlantı adresi>
JWT_SECRET=<güçlü bir gizli anahtar>
NODE_ENV=development
```

```bash
# Backend'i başlat
npm run dev
```

### 3. Frontend Kurulumu

```bash
cd client

# Bağımlılıkları yükle
npm install

# .env dosyası oluştur
echo "VITE_API_URL=http://localhost:5000" > .env
```

```bash
# Frontend'i başlat
npm run dev
```

Uygulama varsayılan olarak `http://localhost:5173` adresinde açılır.

---

## 🔌 API Uçları (Endpoints)

| Yöntem | Endpoint | Açıklama | Yetki |
|---|---|---|---|
| POST | `/api/auth/register` | Yeni kullanıcı kaydı | Public |
| POST | `/api/auth/login` | Giriş yap, JWT al | Public |
| GET | `/api/auth/me` | Oturum bilgisi | Private |
| GET | `/api/projects` | Kullanıcının projeleri | Private |
| POST | `/api/projects` | Yeni proje oluştur | Private |
| GET | `/api/projects/:id` | Proje detayı | Public |
| DELETE | `/api/projects/:id` | Proje sil | Private (Sahip) |
| GET | `/api/projects/shared/:token` | Paylaşılan projeyi görüntüle | Public |
| POST | `/api/projects/shared/:token/clone` | Projeyi kütüphaneye ekle | Private |
| POST | `/api/projects/:id/move` | Şarkıları başka projeye taşı | Private |
| POST | `/api/tracks` | Şarkı oluştur | Private |
| DELETE | `/api/tracks/:id` | Şarkı sil | Private (Sahip) |
| POST | `/api/upload` | Dosya yükle (ses/resim) | Private |

---

## 👨‍💻 Geliştirici

| | |
|---|---|
| **Ad Soyad** | — |
| **Üniversite** | — |
| **Ders** | Yazılım Mühendisliği Projesi |

---

## 📄 Lisans

Bu proje eğitim amaçlı geliştirilmiştir.
