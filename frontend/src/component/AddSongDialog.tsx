// AddSongDialog.tsx

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
        // Fetch existing songs with the same name
        const response = await fetch(
          `http://localhost:5000/songs?songName=${newSongData.songName}`,
        );
        const existingSongs = await response.json();

        if (existingSongs.length > 0) {
          // A song with the same name already exists
          alert(
            "A song with the same name already exists. Please choose a different song name.",
          );
        } else {
          // No song with the same name exists, proceed to create the new song
          await fetch("http://localhost:5000/songs", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...newSongData,
              playlistId: playlistId, // Include the playlistId here
            }),
          });

          onClose();
          onSongAdded();
        }
      } catch (error) {
        console.error("Error checking existing songs:", error);
        // Handle error (e.g., show an error message)
      }
    } else {
      alert("Entering Song Name, Singer and link is a MUST!");
      // Handle error (e.g., show a notification that all fields are required)
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
