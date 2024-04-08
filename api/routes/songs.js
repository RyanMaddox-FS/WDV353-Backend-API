const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Song = require("../models/song");
const Messages = require("../../messages/messages");

// HTTP GET
router.get("/", async (req, res, next) => {
  await Song.find({})
    .select("title artist album _id")
    .exec()
    .then((songList) => {
      // validation to check if collection is empty
      if (songList < 1) {
        res.status(200).json({
          message: Messages.song_collection_empty,
        });
      }
      res.status(200).json({
        message: Messages.song_collection,
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
router.get("/:songId", async (req, res, next) => {
  const { songId } = req.params;

  await Song.findById({ _id: songId })
    .select("title artist album _id")
    .exec()
    .then((songInfo) => {
      // validation to check if song is in collection
      if (!songInfo) {
        return res.status(404).json({
          message: Messages.song_not_found,
        });
      }
      res.status(200).json({
        message: Messages.song_selected,
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

// HTTP POST
router.post("/", async (req, res, next) => {
  await Song.find({ title: req.body.title, artist: req.body.artist, album: req.body.album })
    .exec()
    .then((songInfo) => {
      if (songInfo.length > 0) {
        return res.status(409).json({
          message: Messages.song_post_duplicate,
        });
      }
      const newSong = new Song({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        artist: req.body.artist,
        album: req.body.album,
      });

      newSong
        .save()
        .then((songInfo) => {
          res.status(201).json({
            message: Messages.song_submitted,
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
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({
        error: {
          message: Messages.song_post_error,
        },
      });
    });
});

// HTTP PATCH (by ID)
router.patch("/:songId", async (req, res, next) => {
  const { songId } = req.params;

  const updateSong = {
    title: req.body.title,
    artist: req.body.artist,
    album: req.body.album,
  };

  await Song.findOneAndUpdate({ _id: songId }, updateSong, { new: true })
    .then((songInfo) => {
      // validation to check if song is in collection
      if (!songId) {
        return res.status(404).json({
          error: {
            message: Messages.song_not_found,
          },
        });
      }
      res.status(200).json({
        message: Messages.song_updated,
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
router.delete("/:songId", async (req, res, next) => {
  const { songId } = req.params;

  await Song.findOneAndDelete({ _id: songId })
    .exec()
    .then((songInfo) => {
      // validation to check if song exists in collection
      if (!songId) {
        res.status(404).json({
          error: {
            message: Messages.song_not_found,
          },
        });
      }
      res.status(200).json({
        message: Messages.song_deleted,
        songInfo,
        metadata: {
          host: req.hostname,
          method: req.method,
          url: `http://localhost:3000/songs/${songId}`,
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
