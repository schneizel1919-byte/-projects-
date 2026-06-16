const express = require('express');
const router = express.Router();
const GuestTrack = require('../models/GuestTrack');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });

// POST /api/guest/upload — Misafir şarkı yükle
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { guestToken, title } = req.body;
    if (!guestToken || !req.file) return res.status(400).json({ message: 'Token ve dosya gerekli.' });

    const protocol = req.protocol;
    const host = req.get('host');
    const audioUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

    const track = await GuestTrack.create({ guestToken, title: title || req.file.originalname, audioUrl });
    res.status(201).json(track);
  } catch (error) {
    res.status(500).json({ message: 'Yükleme başarısız.' });
  }
});

// GET /api/guest/:token — Misafirin şarkılarını getir
router.get('/:token', async (req, res) => {
  try {
    const tracks = await GuestTrack.find({ guestToken: req.params.token }).sort({ _id: -1 });
    res.json(tracks);
  } catch (error) {
    res.status(500).json({ message: 'Şarkılar getirilemedi.' });
  }
});

// DELETE /api/guest/:token/:id — Misafir şarkı sil
router.delete('/:token/:id', async (req, res) => {
  try {
    await GuestTrack.findOneAndDelete({ _id: req.params.id, guestToken: req.params.token });
    res.json({ message: 'Silindi.' });
  } catch (error) {
    res.status(500).json({ message: 'Silinemedi.' });
  }
});

module.exports = router;
