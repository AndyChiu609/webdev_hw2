import { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "axios"; // Import Axios

type Playlist = {
  _id: string;
  title: string;
  description: string;
};

type FormDialogProps = {
  open: boolean;
  handleClose: () => void;
  onCreate: () => void;
};

export default function FormDialog({
  open,
  handleClose,
  onCreate,
}: FormDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [titleErr, setTitleErr] = useState(false);
  const [descriptionErr, setDescriptionErr] = useState(false);

  const handleCreate = async () => {
    if (!title) {
      setTitleErr(true);
      return;
    } else {
      setTitleErr(false);
    }
    if (!description) {
      setDescriptionErr(true);
      return;
    } else {
      setDescriptionErr(false);
    }

    try {
      // Use Axios to fetch playlists
      const response = await axios.get("http://localhost:8000/api/playlists");
      const playlists = response.data;

      const titleExists = playlists.some(
        (playlist: Playlist) => playlist.title === title
      );

      if (titleExists) {
        alert(
          "A playlist with this title already exists. Please choose a different title.",
        );
        return;
      }
    } catch (error) {
      console.error("Error fetching playlists:", error);
      alert("Error checking playlist titles. Please try again.");
      return;
    }

    const newPlaylist = {
      title: title,
      description: description,
    };

    try {
      // Use Axios to send a POST request
      const response = await axios.post(
        "http://localhost:8000/api/playlists",
        newPlaylist,
      );
      console.log(response.data);
      handleClose();
      onCreate();
    } catch (error) {
      console.error("Error creating playlist:", error);
      alert("Error creating playlist. Please try again.");
    }
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create Playlist</DialogTitle>
        <DialogContent>
          <DialogContentText></DialogContentText>
          <TextField
            error={titleErr}
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
            }}
            autoFocus
            margin="dense"
            id="name"
            label="Playlist name"
            type="text"
            fullWidth
            variant="standard"
          />
          <TextField
            error={descriptionErr}
            value={description}
            onChange={(event) => {
              setDescription(event.target.value);
            }}
            margin="dense"
            id="description"
            label="Playlist description"
            type="text"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleCreate}>Create</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
