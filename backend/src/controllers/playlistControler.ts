// Import from Mongoose for ID validation
import { Playlist, Song } from "../models/playlist";
import { Request, Response } from "express";
import { Types } from "mongoose";

export const createPlaylist = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;
    const playlist = new Playlist({ title, description });
    await playlist.save();
    res.status(201).json(playlist);
  } catch (error) {
    console.error("Error creating playlist:", error);
    res.status(500).json({ error: "Failed to create playlist" });
  }
};

export const getAllPlaylists = async (req: Request, res: Response) => {
  try {
    const playlists = await Playlist.find();
    res.status(200).json(playlists);
  } catch (error) {
    console.error("Error fetching playlists:", error);
    res.status(500).json({ error: "Failed to fetch playlists" });
  }
};

export const getPlaylistById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid ID format" });
  }

  try {
    const playlist = await Playlist.findById(id);
    if (!playlist) {
      return res.status(404).json({ error: "Playlist not found" });
    }
    res.status(200).json(playlist);
  } catch (error) {
    console.error("Error fetching playlist by ID:", error);
    res.status(500).json({ error: "Failed to fetch playlist" });
  }
};

export const updatePlaylistById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description } = req.body;

  if (!Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid ID format" });
  }

  try {
    const playlist = await Playlist.findByIdAndUpdate(
      id,
      { title, description },
      { new: true },
    );
    if (!playlist) {
      return res.status(404).json({ error: "Playlist not found" });
    }
    res.status(200).json(playlist);
  } catch (error) {
    console.error("Error updating playlist by ID:", error);
    res.status(500).json({ error: "Failed to update playlist" });
  }
};

export const deletePlaylistById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid ID format" });
  }

  try {
    const playlist = await Playlist.findByIdAndRemove(id);
    if (!playlist) {
      return res.status(404).json({ error: "Playlist not found" });
    }

    // Delete songs associated with this playlist
    await Song.deleteMany({ playlistId: id });

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting playlist by ID:", error);
    res.status(500).json({ error: "Failed to delete playlist" });
  }
};

export const createSongForPlaylist = async (req: Request, res: Response) => {
  const { playlistId } = req.params;
  const { songName, singer, link } = req.body;

  if (!Types.ObjectId.isValid(playlistId)) {
    return res.status(400).json({ error: "Invalid playlist ID format" });
  }

  try {
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      return res.status(404).json({ error: "Playlist not found" });
    }

    const song = new Song({ songName, singer, link, playlistId });
    await song.save();
    res.status(201).json(song);
  } catch (error) {
    console.error("Error creating song:", error);
    res.status(500).json({ error: "Failed to create song" });
  }
};

export const getSongsForPlaylist = async (req: Request, res: Response) => {
  const { playlistId } = req.params;

  if (!Types.ObjectId.isValid(playlistId)) {
    return res.status(400).json({ error: "Invalid playlist ID format" });
  }

  try {
    const songs = await Song.find({ playlistId });
    res.status(200).json(songs);
  } catch (error) {
    console.error("Error fetching songs for playlist:", error);
    res.status(500).json({ error: "Failed to fetch songs for playlist" });
  }
};

export const deleteSongById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid ID format" });
  }

  try {
    const song = await Song.findByIdAndRemove(id);
    if (!song) {
      return res.status(404).json({ error: "Song not found" });
    }
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting song by ID:", error);
    res.status(500).json({ error: "Failed to delete song" });
  }
};

export const updateSongById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const songData = req.body;

  if (!Types.ObjectId.isValid(id)) {
    console.error("Invalid ID format:", id);
    return res.status(400).json({ error: "Invalid ID format" });
  }

  try {
    console.log("Updating song with ID:", id);
    console.log("Updated data:", songData);

    const song = await Song.findByIdAndUpdate(id, songData, { new: true });

    if (!song) {
      console.error("Song not found with ID:", id);
      return res.status(404).json({ error: "Song not found" });
    }

    console.log("Updated song:", song);
    res.status(200).json(song);
  } catch (error) {
    console.error("Error updating song by ID:", error);
    res.status(500).json({ error: "Failed to update song" });
  }
};
