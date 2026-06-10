const User = require('../models/User');
const Project = require('../models/Project');
const Track = require('../models/Track');

// @desc    Tüm kullanıcıları getir (Admin)
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// @desc    Kullanıcı profilini güncelle
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = req.body.name || user.name;
    user.profilePicture = req.body.profilePicture || user.profilePicture;

    // Şifre güncelleniyorsa pre-save hook tekrar çalışır ve hashler
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      profilePicture: updatedUser.profilePicture,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Kullanıcıyı sil (Admin)
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User removed successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Belirli bir sanatçının projelerini listele
// @route   GET /api/users/:id/projects
// @access  Public
const getProjectsByArtist = async (req, res, next) => {
  try {
    // Kullanıcının var olup olmadığını doğrula
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'Artist not found' });
    }

    const projects = await Project.find({ artist: req.params.id })
      .populate('artist', 'name email profilePicture')
      .populate('tracks', 'title audioUrl duration')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      artist: { _id: user._id, name: user.name, profilePicture: user.profilePicture },
      count: projects.length,
      projects
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllUsers, updateProfile, deleteUser, getProjectsByArtist };
