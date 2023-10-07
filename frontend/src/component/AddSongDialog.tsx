// AddSongDialog.tsx
import axios from "axios";
import { AxiosError } from 'axios';
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

type AddSongDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSongAdded: () => void;
  playlistId: string; // <-- Add this
};

const AddSongDialog: React.FC<AddSongDialogProps> = ({
  isOpen,
  onClose,
  onSongAdded,
  playlistId,
}) => {
  const [newSongData, setNewSongData] = useState({
    songName: "",
    singer: "",
    link: "",
  });

  const handleNewSongChange =
    (field: keyof typeof newSongData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setNewSongData((prev) => ({ ...prev, [field]: event.target.value }));
    };

    const handleSaveNewSong = async () => {
      if (newSongData.songName && newSongData.singer && newSongData.link) {
          try {
              // Fetch all songs for the current playlist
              const response = await axios.get(
                  `http://localhost:8000/api/playlists/${playlistId}/songs`
              );
              const existingSongs = response.data;
  
              // Check if a song with the given name already exists in the playlist
              const songExists = existingSongs.some(
                (song: { songName: string }) => song.songName === newSongData.songName
            );
  
              if (songExists) {
                  alert(
                      "A song with the same name already exists in this playlist. Please choose a different song name."
                  );
              } else {
                  // No song with the same name exists in the current playlist, proceed to create the new song
                  await axios.post(`http://localhost:8000/api/playlists/${playlistId}/songs`, newSongData);
  
                  onClose();
                  onSongAdded();
              }
          } catch (error) {
              const axiosError = error as AxiosError;
  
              if (axiosError.response) {
                  console.error("Data:", axiosError.response.data);
                  console.error("Status:", axiosError.response.status);
                  console.error("Headers:", axiosError.response.headers);
              } else if (axiosError.request) {
                  console.error("No response received:", axiosError.request);
              } else {
                  console.error("Error setting up the request", axiosError.message);
              }
  
              alert("Error occurred while adding the song. Please try again.");
          }
      } else {
          alert("Entering Song Name, Singer and link is a MUST!");
      }
  };
  
    

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Add New Song</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Song Name"
          value={newSongData.songName}
          onChange={handleNewSongChange("songName")}
        />
        <TextField
          fullWidth
          label="Singer"
          value={newSongData.singer}
          onChange={handleNewSongChange("singer")}
        />
        <TextField
          fullWidth
          label="Link"
          value={newSongData.link}
          onChange={handleNewSongChange("link")}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="primary" onClick={handleSaveNewSong}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddSongDialog;
