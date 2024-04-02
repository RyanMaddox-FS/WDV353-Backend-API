const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Artist = require('../models/artist');


// HTTP GET
router.get('/', async (req, res, next) => {
  await Artist.find({})
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
router.get('/:artistId', async (req, res, next) => {
  const { artistId } = req.params;

 await Artist.findById({ _id: artistId })
    .then((artist) => {
      res.status(200).json({
        message: `Artist selected`,
        artist,
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
  const newArtist = new Artist({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
      albumName: req.body.albumName,
      albumYear: req.body.albumYear,
      ep: req.body.ep,
  });

 await newArtist
    .save()
    .then((artist) => {
      res.status(201).json({
        message: `Artist submitted`,
        artist,
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
router.patch('/:artistId', async (req, res, next) => {
  const { artistId } = req.params;

  const updateArtist = {
    name: req.body.name,
      albumName: req.body.albumName,
      albumYear: req.body.albumYear,
      ep: req.body.ep,
  };

  await Artist.findOneAndUpdate({ _id: artistId }, updateArtist, {new: true })
    .then((artist) => {
      res.status(200).json({
        message: `Artist updated`,
        artist,
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
router.delete('/:songId', async (req, res, next) => {
  const { artistId } = req.params;

  await Artist.findOneAndDelete({ _id: artistId })
    .then((artist) => {
      res.status(200).json({
        message: `Artist deleted`,
        artist,
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