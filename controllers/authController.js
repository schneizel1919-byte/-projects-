const User = require('../models/User');
const jwt = require('jsonwebtoken');

// JWT oluşturma yardımcı fonksiyonu
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// @desc    Yeni kullanıcı kaydı
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, profilePicture } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'A user with this email already exists' });
    }

    const user = await User.create({ name, email, password, profilePicture });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Kullanıcı girişi
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Şifreyi de sorguda getir (select: false olduğu için açıkça belirtilmeli)
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Giriş yapmış kullanıcının profilini getir
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  res.json(req.user);
};

module.exports = { registerUser, loginUser, getMe };
