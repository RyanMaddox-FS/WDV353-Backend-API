const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Song = require('../models/song');
const { update } = require('../models/song');

// HTTP GET
router.get('/', (req, res, next) => {
  Song.find({})
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
router.get('/:songId', (req, res, next) => {
  const { songId } = req.params;

  Song.findById({ _id: songId })
    .then((result) => {
      res.status(200).json({
        message: `Song selected`,
        song: {
          id: result._id,
          title: result.title,
          artist: result.artist,
          album: result.album,
        },
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
router.post('/', (req, res, next) => {
  const newSong = new Song({
    _id: mongoose.Types.ObjectId(),
    title: req.body.title,
    artist: req.body.artist,
    album: req.body.album,
  });

  newSong
    .save()
    .then((result) => {
      res.status(201).json({
        message: `Song submitted`,
        result,
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
router.patch('/:songId', (req, res, next) => {
  const { songId } = req.params;

  const updateSong = {
    title: req.body.title,
    artist: req.body.artist,
    album: req.body.album,
  };

  Song.updateOne(
    { _id: songId },
    {
      $set: updateSong,
    }
  )
    .then((result) => {
      res.status(200).json({
        message: `Song updated`,
        result,
        song: {
          id: songId,
          title: updateSong.title,
          artist: updateSong.artist,
          album: updateSong.album,
        },
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
router.delete('/:songId', (req, res, next) => {
  const { songId } = req.params;

  const deleteSong = {
    title: req.body.title,
    artist: req.body.artist,
    album: req.body.album,
  };

  Song.findByIdAndDelete({ _id: songId }, { $set: deleteSong })
    .then((result) => {
      res.status(200).json({
        message: `Song deleted`,
        result,
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
