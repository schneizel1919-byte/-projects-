const mongoose = require('mongoose');

const guestTrackSchema = new mongoose.Schema({
  guestToken: { type: String, required: true, index: true },
  title: { type: String, required: true },
  audioUrl: { type: String, required: true },
  // TTL Index: 24 saat sonra MongoDB otomatik siler
  expiresAt: { type: Date, default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), index: { expires: 0 } },
});

module.exports = mongoose.model('GuestTrack', guestTrackSchema);
