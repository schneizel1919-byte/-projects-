const Project = require('../models/Project');
const Track = require('../models/Track');
const crypto = require('crypto');

// @desc    Tüm projeleri getir
// @route   GET /api/projects
// @access  Public
const getAllProjects = async (req, res, next) => {
  try {
    // Sadece giriş yapan kullanıcının kendi projelerini getir (Private Workspace)
    const projects = await Project.find({ artist: req.user._id })
      .populate('artist', 'name email profilePicture')
      .populate('tracks', 'title audioUrl duration');
    res.json(projects);
  } catch (error) {
    next(error);
  }
};

// @desc    Tek bir projeyi ID ile getir
// @route   GET /api/projects/:id
// @access  Public
const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('artist', 'name email profilePicture')
      .populate('tracks');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    next(error);
  }
};

// @desc    Yeni proje oluştur
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res, next) => {
  try {
    const { title, description, coverImageUrl } = req.body;

    const project = await Project.create({
      title,
      description,
      coverImageUrl,
      shareToken: crypto.randomBytes(12).toString('hex'), // Benzersiz paylaşım linki için token
      artist: req.user._id, // Giriş yapan kullanıcı sanatçı olarak atanır
      tracks: [],
    });

    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
};

// @desc    Projeyi güncelle
// @route   PUT /api/projects/:id
// @access  Private (sadece proje sahibi veya admin)
const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Yetki kontrolü: Sanatçı mı yoksa admin mi?
    if (
      project.artist.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to update this project' });
    }

    const { title, description, coverImageUrl } = req.body;
    project.title = title || project.title;
    project.description = description !== undefined ? description : project.description;
    project.coverImageUrl = coverImageUrl || project.coverImageUrl;

    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (error) {
    next(error);
  }
};

// @desc    Projeyi sil
// @route   DELETE /api/projects/:id
// @access  Private (sadece proje sahibi veya admin)
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (
      project.artist.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to delete this project' });
    }

    await project.deleteOne();
    res.json({ message: 'Project removed successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Share token ile projeyi getir (Misafir Görüntüleme)
// @route   GET /api/projects/shared/:token
// @access  Public
const getSharedProject = async (req, res, next) => {
  try {
    const project = await Project.findOne({ shareToken: req.params.token })
      .populate('artist', 'name profilePicture')
      .populate('tracks');

    if (!project) {
      return res.status(404).json({ message: 'Shared project not found or token is invalid' });
    }

    res.json(project);
  } catch (error) {
    next(error);
  }
};

// @desc    Share token ile projeyi kütüphaneye ekle (Clone)
// @route   POST /api/projects/shared/:token/clone
// @access  Private
const cloneProject = async (req, res, next) => {
  try {
    const original = await Project.findOne({ shareToken: req.params.token }).populate('tracks');
    if (!original) return res.status(404).json({ message: 'Proje bulunamadı veya link geçersiz.' });
    if (original.artist.toString() === req.user._id.toString())
      return res.status(400).json({ message: 'Bu zaten senin projen!' });

    // Şarkıları klonla
    const clonedTracks = await Promise.all(
      original.tracks.map(t => Track.create({ title: t.title, audioUrl: t.audioUrl, duration: t.duration, artist: req.user._id, project: null }))
    );

    // Projeyi klonla
    const cloned = await Project.create({
      title: `${original.title} (kopya)`,
      description: original.description,
      coverImageUrl: original.coverImageUrl,
      shareToken: require('crypto').randomBytes(12).toString('hex'),
      artist: req.user._id,
      tracks: clonedTracks.map(t => t._id),
    });

    // Track'leri klonlanan projeye bağla
    await Track.updateMany({ _id: { $in: clonedTracks.map(t => t._id) } }, { project: cloned._id });

    res.status(201).json(cloned);
  } catch (error) { next(error); }
};

module.exports = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getSharedProject,
  cloneProject,
};
