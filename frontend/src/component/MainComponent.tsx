import AddPlayListDialog from "./AddPlaylistDialog";
import PlaylistCard from "./PlayListCard";
import image from "../public/image.png";

import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import { useState, useEffect } from "react";
import "../App.css";

type playlist = {
  id: string;
  title: string;
  description: string;
  songs: any[]; // change this if you have a specific structure in mind
};

function MainComponent() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [playlists, setPlaylists] = useState<playlist[]>([]); // 用於存儲播放列表的 state

  const fetchPlaylists = async () => {
    try {
      const response = await fetch("http://localhost:5000/playlists");
      const data = await response.json();
      setPlaylists(data);
    } catch (error) {
      console.error("Error fetching playlists:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/playlists/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Instead of fetching the entire list again, remove the deleted item from the state.
        setPlaylists((prev) => prev.filter((playlist) => playlist.id !== id));
      } else {
        console.error("Error deleting playlist:", await response.text());
      }
    } catch (error) {
      console.error("Error deleting playlist:", error);
    }
  };

  useEffect(() => {
    // 獲取播放列表的函數
    fetchPlaylists();
  }, []); // 這個空的依賴列表確保 fetchPlaylists 只在組件初次渲染時運行

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

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

        {playlists.map((playlist) => (
          <PlaylistCard
            key={playlist.id}
            title={playlist.title}
            description={playlist.description}
            image={image}
            id={playlist.id}
            deleteMode={deleteMode}
            onDelete={() => handleDelete(playlist.id)}
          />
        ))}

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
