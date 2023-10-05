//import * as React from 'react';
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";

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
  // 不再需要這裡的 state，因為 open 的狀態將從 props 接收
  const [title, setTtile] = useState("");
  const [description, setDescription] = useState("");
  const [titleErr, setTitleErr] = useState(false);
  const [discriptionErr, setDiscriptionErr] = useState(false);

  const handleCreate = (title: string, description: string) => {
    if (!title) {
      setTitleErr(true);
      return;
      // early return
    } else {
      setTitleErr(false);
    }
    if (!description) {
      setDiscriptionErr(true);
      return;
      // early return
    } else {
      setTitleErr(false);
    }
    const newPlaylist = {
      id: String(Math.random()),
      title: title,
      description: description,
      songs: [],
      // stuff: "hellow"
    };

    fetch("http://localhost:5000/playlists", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPlaylist),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error(
            `HTTP error! Status: ${res.status} ${res.statusText}`,
          );
        }
      })
      .then((data) => {
        console.log(data);
        handleClose();
        onCreate();
      })
      .catch((err) => {
        console.log("fail", err);
      });
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Creat PlayList</DialogTitle>
        <DialogContent>
          <DialogContentText></DialogContentText>
          <TextField
            error={titleErr}
            value={title}
            onChange={(event) => {
              setTtile(event.target.value);
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
            error={discriptionErr}
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
          <Button onClick={() => handleCreate(title, description)}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
