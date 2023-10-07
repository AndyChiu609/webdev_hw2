import mongoose from "mongoose";

// Define the schema for Playlist
export const playlistSchema = new mongoose.Schema({
  title: String,
  description: String,
});

// Define the schema for Song
export const songSchema = new mongoose.Schema({
  songName: String,
  singer: String,
  link: String,
  playlistId: mongoose.Schema.Types.ObjectId, // Reference to Playlist
});

// Create models for Playlist and Song using the schemas
export const Playlist = mongoose.model("Playlist", playlistSchema);
export const Song = mongoose.model("Song", songSchema);
