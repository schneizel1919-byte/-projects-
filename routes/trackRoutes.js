const express = require('express');
const router = express.Router();
const {
  getTracksByProject,
  getTrackById,
  createTrack,
  deleteTrack,
} = require('../controllers/trackController');
const { protect } = require('../middleware/authMiddleware');

// GET /api/tracks/project/:projectId → Projeye ait track'ler (Public)
router.get('/project/:projectId', getTracksByProject);

// GET    /api/tracks/:id → Tek track (Public)
// DELETE /api/tracks/:id → Track sil (Private)
router.route('/:id').get(getTrackById).delete(protect, deleteTrack);

// POST /api/tracks → Track oluştur (Private)
router.post('/', protect, createTrack);

module.exports = router;
