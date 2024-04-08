const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Artist = require("../models/artist");
const Messages = require("../../messages/messages");

// HTTP GET
router.get("/", async (req, res, next) => {
  await Artist.find({})
    .select("name albumName albumYear ep _id")
    .exec()
    .then((artistList) => {
      // validation to check if collection is empty
      if (artistList < 1) {
        res.status(200).json({
          message: Messages.artists_empty,
        });
      }
      res.status(200).json({
        message: Messages.artists,
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
router.get("/:artistId", async (req, res, next) => {
  const { artistId } = req.params;

  await Artist.findById({ _id: artistId })
    .select("name albumName albumYear ep _id")
    .populate("song", "title")
    .exec()
    .then((artist) => {
      // validation to check if artist is in collection
      if (!artist) {
        return res.status(404).json({
          message: Messages.artist_not_found,
        });
      }

      res.status(200).json({
        message: Messages.artist_found,
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

// HTTP POST
router.post("/", async (req, res, next) => {
  await Artist.find({
    name: req.body.name,
    albumName: req.body.albumName,
    albumYear: req.body.albumYear,
    ep: req.body.ep,
    song: req.body.song,
  })
    .exec()
    .then((artist) => {
      // validation to check if artist is already in database
      if (artist.length > 0) {
        return res.status(409).json({
          message: Messages.artist_post_duplicate,
        });
      }

      const newArtist = new Artist({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        albumName: req.body.albumName,
        albumYear: req.body.albumYear,
        ep: req.body.ep,
        song: req.body.song,
      });

      newArtist
        .save()
        .then((artist) => {
          res.status(201).json({
            message: Messages.artist_submitted,
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
    })
    .catch((err) => {
      res.status(500).json({
        error: {
          message: Messages.artist_post_error,
        },
      });
    });
});

// HTTP PATCH (by ID)
router.patch("/:artistId", async (req, res, next) => {
  const { artistId } = req.params;

  const updateArtist = {
    name: req.body.name,
    albumName: req.body.albumName,
    albumYear: req.body.albumYear,
    ep: req.body.ep,
  };

  await Artist.findOneAndUpdate({ _id: artistId }, updateArtist, { new: true })
    .exec()
    .then((artist) => {
      //console.log(artist);

      // validation to check if artist is in collection
      if (!artistId) {
        res.status(404).json({
          error: {
            message: Messages.artist_not_found,
          },
        });
      }
      res.status(200).json({
        message: Messages.artist_updated,
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
router.delete("/:artistId", async (req, res, next) => {
  const { artistId } = req.params;

  await Artist.findOneAndDelete({ _id: artistId })
    .exec()
    .then((artist) => {
      if (!artistId) {
        return res.status(404).json({
          error: {
            message: Messages.artist_not_found,
          },
        });
      }
      res.status(200).json({
        message: Messages.artist_deleted,
        artist,
        metadata: {
          host: req.hostname,
          method: req.method,
          url: `http://localhost:3000/artists/${artistId}`,
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