const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// Eğer uploads klasörü yoksa oluştur
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer Disk Storage Ayarları
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `audio-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// Sadece ses ve resim (kapak için) dosyalarına izin ver
function checkFileType(file, cb) {
  const filetypes = /mp3|wav|ogg|jpg|jpeg|png|mpeg/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Desteklenmeyen dosya formatı! Sadece mp3/wav veya jpg/png yükleyebilirsiniz.'));
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// @route   POST /api/upload
// @desc    Yerel dosya yükle ve URL'sini dön
// @access  Private
router.post('/', protect, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Lütfen bir dosya seçin' });
  }
  
  // Windows'daki ters slash (\) karakterlerini URL için düz slasha (/) çevirir
  const normalizedPath = req.file.path.replace(/\\/g, '/');
  
  // Örn: /uploads/audio-123456.mp3
  res.json({ url: `http://localhost:5000/${normalizedPath}` });
});

module.exports = router;
