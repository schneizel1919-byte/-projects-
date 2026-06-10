const Track = require('../models/Track');
const Project = require('../models/Project');

// @desc    Bir projeye ait tüm track'leri getir
// @route   GET /api/tracks/project/:projectId
// @access  Public
const getTracksByProject = async (req, res, next) => {
  try {
    const tracks = await Track.find({ project: req.params.projectId });
    res.json(tracks);
  } catch (error) {
    next(error);
  }
};

// @desc    Tek bir track getir
// @route   GET /api/tracks/:id
// @access  Public
const getTrackById = async (req, res, next) => {
  try {
    const track = await Track.findById(req.params.id).populate('project', 'title');

    if (!track) {
      return res.status(404).json({ message: 'Track not found' });
    }

    res.json(track);
  } catch (error) {
    next(error);
  }
};

// @desc    Yeni track ekle
// @route   POST /api/tracks
// @access  Private
const createTrack = async (req, res, next) => {
  try {
    const { title, audioUrl, duration, projectId } = req.body;

    let project = null;
    if (projectId) {
      project = await Project.findById(projectId);
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
      
      // Yalnızca proje sahibi veya admin track ekleyebilir
      if (
        project.artist.toString() !== req.user._id.toString() &&
        req.user.role !== 'admin'
      ) {
        return res.status(403).json({ message: 'Not authorized to add tracks to this project' });
      }
    }

    const track = await Track.create({
      title,
      audioUrl,
      duration,
      project: projectId || null,
      artist: req.user._id, // Şarkının sahibi
    });

    if (project) {
      // Oluşturulan track'i projenin tracks dizisine ekle
      project.tracks.push(track._id);
      await project.save();
    }

    res.status(201).json(track);
  } catch (error) {
    next(error);
  }
};

// @desc    Track'i sil
// @route   DELETE /api/tracks/:id
// @access  Private
const deleteTrack = async (req, res, next) => {
  try {
    const track = await Track.findById(req.params.id);

    if (!track) {
      return res.status(404).json({ message: 'Track not found' });
    }

    // Yetki kontrolü: Track'in sahibi, proje sahibi veya admin silebilir
    let isAuthorized = req.user.role === 'admin';
    if (track.artist && track.artist.toString() === req.user._id.toString()) {
      isAuthorized = true;
    }

    const project = await Project.findById(track.project);
    if (project && project.artist.toString() === req.user._id.toString()) {
      isAuthorized = true;
    }

    if (!isAuthorized) {
      return res.status(403).json({ message: 'Not authorized to delete this track' });
    }

    // Track'i projeden de kaldır
    if (project) {
      project.tracks = project.tracks.filter(
        (t) => t.toString() !== track._id.toString()
      );
      await project.save();
    }

    await track.deleteOne();
    res.json({ message: 'Track removed successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTracksByProject, getTrackById, createTrack, deleteTrack };
