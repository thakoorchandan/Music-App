const mongoose = require("mongoose");

const albumSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    artist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "artist",
        required: true,
      },
    ],
    album_name: { type: String, required: true },
    genre: { type: String, required: true },
    cover_photo: { type: String, required: true },
    year: { type: Number, required: true },
    songs: [
      {
        name: { type: String, required: true },
        photo: { type: String, required: true },
        duration: { type: String, required: true },
      },
    ],
  },
  {
    versionKey: false,
  }
);

const Album = mongoose.model("albums", albumSchema);

module.exports = Album;
