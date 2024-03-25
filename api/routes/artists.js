const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Artist = require('../models/artist');
const { update } = require('../models/artist');

// HTTP GET
router.get('/', (req, res, next) => {
  Artist.find({})
    .then((artistList) => {
      res.status(200).json({
        message: `Artist Collection`,
        artistList,
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

// HTTP GET (by ID)
router.get('/:artistId', (req, res, next) => {
  const { artistId } = req.params;

  Artist.findById({ _id: artistId })
    .then((result) => {
      res.status(200).json({
        message: `Artist selected`,
        artist: {
          id: result._id,
          name: result.name,
          album: {
            albumName: result.album.albumName,
            albumYear: result.album.albumYear,
            ep: result.album.ep,
          },
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
  const newArtist = new Artist({
    _id: mongoose.Types.ObjectId(),
    name: req.body.name,
    album: {
      albumName: req.body.album.albumName,
      albumYear: req.body.album.albumYear,
      ep: req.body.album.ep,
    },
  });

  newArtist
    .save()
    .then((result) => {
      res.status(201).json({
        message: `Artist submitted`,
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
router.patch('/:artistId', (req, res, next) => {
  const { artistId } = req.params;

  const updateArtist = {
    name: req.body.name,
    album: {
      albumName: req.body.album.albumName,
      albumYear: req.body.album.albumYear,
      ep: req.body.album.ep,
    },
  };

  Artist.updateOne({ _id: artistId }, { $set: updateArtist })
    .then((result) => {
      res.status(200).json({
        message: `Artist updated`,
        result,
        artist: {
          id: artistId,
          name: updateArtist.name,
          album: {
            albumName: updateArtist.album.albumName,
            albumYear: updateArtist.album.albumYear,
            ep: updateArtist.album.ep,
          },
        },
        metadata: {
          host: req.hostname,
          method: req.method,
        },
      });
    })
    .catch((err) =>
      res.status(500).json({
        error: {
          message: err.message,
        },
      })
    );
});

// HTTP DELETE (by ID)
router.delete('/:songId', (req, res, next) => {
  const { artistId } = req.params;

  const deleteArtist = {
    name: req.body.name,
    album: {
      albumName: req.body.album.albumName,
      albumYear: req.body.album.albumYear,
      ep: req.body.album.ep,
    },
  };

  Artist.findByIdAndDelete({ _id: artistId }, { $set: deleteArtist })
    .then((result) => {
      res.status(200).json({
        message: `Artist deleted`,
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
