const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Song = require('../models/song');

// HTTP GET
router.get('/', async (req, res, next) => {
 await Song.find({})
    .then((songList) => {
      res.status(200).json({
        message: `Song Collection`,
        songList,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: {
          message: err.message,
        },
      });
    });
});

// HTTP GET by ID
router.get('/:songId', async (req, res, next) => {
  const { songId } = req.params;

 await Song.findById({ _id: songId })
    .then((songInfo) => {
      res.status(200).json({
        message: `Song selected`,
        songInfo,
        metadata: {
          host: req.hostname,
          method: req.method,
        },
      });
    })
    .catch((err) => {
      res.status(404).json({
        error: {
          message: err.message,
        },
      });
    });
});

// HTTP POST
router.post('/', async (req, res, next) => {
  const newSong = new Song({
    _id: new mongoose.Types.ObjectId(),
    title: req.body.title,
    artist: req.body.artist,
    album: req.body.album,
  });

 await newSong
    .save()
    .then((songInfo) => {
      res.status(201).json({
        message: `Song submitted`,
        songInfo,
        metadata: {
          host: req.hostname,
          method: req.method,
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: {
          message: err.message,
        },
      });
    });
});

// HTTP PATCH (by ID)
router.patch('/:songId', async (req, res, next) => {
  const { songId } = req.params;

  const updateSong = {
    title: req.body.title,
    artist: req.body.artist,
    album: req.body.album,
  };

 await Song.findOneAndUpdate(
    { _id: songId },
    updateSong,
    {new: true}
  )
    .then((songInfo) => {
      res.status(200).json({
        message: `Song updated`,
        songInfo,
        metadata: {
          host: req.hostname,
          method: req.method,
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: {
          message: err.message,
        },
      });
    });
});

// HTTP DELETE (by ID)
router.delete('/:songId', async (req, res, next) => {
  const { songId } = req.params;

 await Song.findOneAndDelete({ _id: songId })
    .then((songInfo) => {
      res.status(200).json({
        message: `Song deleted`,
        songInfo,
        metadata: {
          host: req.hostname,
          method: req.method,
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: {
          message: err.message,
        },
      });
    });
});
module.exports = router;