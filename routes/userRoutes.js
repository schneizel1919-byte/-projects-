const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  updateProfile,
  deleteUser,
  getProjectsByArtist,
} = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// GET /api/users              → Admin: tüm kullanıcılar
router.get('/', protect, adminOnly, getAllUsers);

// PUT /api/users/profile      → Kullanıcı kendi profilini günceller
router.put('/profile', protect, updateProfile);

// GET /api/users/:id/projects → Bir sanatçının tüm projeleri (Public)
router.get('/:id/projects', getProjectsByArtist);

// DELETE /api/users/:id       → Admin: kullanıcı sil
router.delete('/:id', protect, adminOnly, deleteUser);

module.exports = router;

