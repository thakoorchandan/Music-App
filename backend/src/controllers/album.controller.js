const express = require("express");

const Album = require("../models/album.model");

const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");

const router = express.Router();

router.get("/", authenticate, authorize(["artist"]), async function (req, res) {
  const page = Number(req.params.page) || 1; //Page No
  const size = Number(req.params.size) || 10; //Size of the data
  const offset = (page - 1) * size; //Formula for the page offset
  const albums = await Album.find().skip(offset).limit(size).lean().exec();
  const totalAlbumsCount = await Album.find().countDocuments();
  const totalPages = Math.ceil(totalAlbumsCount / size);
  const user = req.user;
  return res.status(200).send({ albums, user, totalPages });
});

router.patch("/:id", authenticate, authorize(["artist"]), async (req, res) => {
  const albums = await Album.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  })
    .lean()
    .exec();
  const user = req.user;
  return res.status(200).send({ user, albums });
});

router.delete("/:id", authenticate, authorize(["admin"]), async (req, res) => {
  const albums = await Album.findByIdAndDelete(req.params.id, req.body).lean();
  const user = req.user;
  return res.status(200).send({ user, albums });
});

module.exports = router;
