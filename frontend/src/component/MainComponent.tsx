import AddPlayListDialog from "./AddPlaylistDialog";
import PlaylistCard from "./PlayListCard";
import image from "../public/image.png";
import "./main-component.css";


import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import { useState, useEffect } from "react";

import axios from "axios";
import { AxiosError } from "axios";

type playlist = {
  _id: string;
  title: string;
  description: string;
};

function MainComponent() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [playlists, setPlaylists] = useState<playlist[]>([]);

  const fetchPlaylists = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/playlists");
      setPlaylists(response.data);
    } catch (error) {
      console.error("Error fetching playlists:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/api/playlists/${id}`,
      );
      if (response.status === 204) {
        setPlaylists((prev) => prev.filter((playlist) => playlist._id !== id));
      } else {
        console.error("Error deleting playlist:", response.data.error);
      }
    } catch (error) {
      const axiosError = error as AxiosError; // Type assertion

      console.error("Error deleting playlist:", axiosError.message);

      if (axiosError.response && axiosError.response.data) {
        console.error("Server response:", axiosError.response.data);
      }
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  console.log(playlists);

  return (
    <>
      <main>
        <Box sx={{ display: "flex", margin: "20px" }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            PlayList
          </Typography>
          <Button
            variant="contained"
            sx={{ marginRight: "10px" }}
            onClick={handleOpenDialog}
          >
            add
          </Button>
          <Button
            variant="contained"
            onClick={() => setDeleteMode(!deleteMode)}
          >
            {deleteMode ? "Done" : "Delete"}
          </Button>
        </Box>

        <div className="grid-wrapper">
          {playlists.map((playlist) => (
            <PlaylistCard
              key={playlist._id}
              title={playlist.title}
              // description={playlist.description}
              image={image}
              id={playlist._id}
              deleteMode={deleteMode}
              onDelete={() => handleDelete(playlist._id)}
            />
          ))}
        </div>

        <AddPlayListDialog
          open={dialogOpen}
          handleClose={handleCloseDialog}
          onCreate={fetchPlaylists}
        />
      </main>
    </>
  );
}

export default MainComponent;
