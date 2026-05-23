const mongoose = require('mongoose');

const trackSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Track title is required'],
      trim: true,
    },
    audioUrl: {
      type: String,
      required: [true, 'Audio URL is required'],
    },
    duration: {
      type: Number, // Saniye cinsinden süre
      default: 0,
      min: [0, 'Duration cannot be negative'],
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      // required kaldırıldı, bağımsız şarkı eklenebilir
    },
    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Track must belong to an artist (user)'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Track', trackSchema);
