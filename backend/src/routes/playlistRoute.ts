import {
  createPlaylist,
  getAllPlaylists,
  getPlaylistById,
  updatePlaylistById,
  deletePlaylistById,
  createSongForPlaylist,
  getSongsForPlaylist,
  deleteSongById,
  updateSongById,
} from "../controllers/playlistControler";
import express from "express";

// Import your controller functions

const router = express.Router();

// RESTful API routes for Playlists
router.post("/", createPlaylist); // Create a new playlist
router.get("/", getAllPlaylists); // Get all playlists
router.get("/:id", getPlaylistById); // Get a playlist by ID
router.put("/:id", updatePlaylistById); // Update a playlist by ID
router.delete("/:id", deletePlaylistById); // Delete a playlist by ID

// RESTful API routes for Songs
router.post("/:playlistId/songs", createSongForPlaylist); // Create a new song for a playlist
router.get("/:playlistId/songs", getSongsForPlaylist); // Get all songs for a playlist
router.delete("/songs/:id", deleteSongById); // Delete a song by ID
router.put("/songs/:id", updateSongById);

export default router;
