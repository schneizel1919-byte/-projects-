const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    coverImageUrl: {
      type: String,
      default: '',
    },
    shareToken: {
      type: String,
      unique: true,
      sparse: true, // Bazı projelerde olmayabilir başta
    },
    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Project must have an artist'],
    },
    tracks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Track',
      },
    ],
  },
  { timestamps: true } // createdAt ve updatedAt otomatik eklenir
);

module.exports = mongoose.model('Project', projectSchema);
