const express = require('express');
const router = express.Router();
const {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getSharedProject,
  cloneProject,
} = require('../controllers/projectController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/shared/:token', getSharedProject);
router.post('/shared/:token/clone', protect, cloneProject);

// GET  /api/projects        → Tüm projeler (Artık Private - Sadece kullanıcının kendi projeleri)
// POST /api/projects        → Proje oluştur (Private)
router.route('/').get(protect, getAllProjects).post(protect, createProject);

// GET    /api/projects/:id  → Proje detayı (Public)
// PUT    /api/projects/:id  → Güncelle (Sadece proje sahibi)
// DELETE /api/projects/:id  → Sil (Proje sahibi VEYA Admin)
router
  .route('/:id')
  .get(getProjectById)
  .put(protect, updateProject)
  .delete(protect, deleteProject); // Sahiplik + admin kontrolü controller'da yapılıyor

module.exports = router;
