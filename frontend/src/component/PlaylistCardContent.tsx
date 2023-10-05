import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import image from "../public/image.png";
import SongsTable from "./SongsTable";
import AddSongDialog from "./AddSongDialog";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog"; // Import the DeleteConfirmationDialog component
import { Button } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

type Playlist = {
  id: string;
  title: string;
  description: string;
};

export type Song = {
  id: string;
  songName: string;
  singer: string;
  link: string;
};

function PlaylistCardContent() {
  const { id } = useParams<{ id: string }>();
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [selected, setSelected] = useState<readonly string[]>([]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const handleAddDialogOpen = () => setAddDialogOpen(true);
  const handleAddDialogClose = () => setAddDialogOpen(false);
  const [copyDialogOpen, setCopyDialogOpen] = useState(false);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // State for delete confirmation dialog
  const [selectedSongsForDeletion, setSelectedSongsForDeletion] = useState<Song[]>(
    []
  );

  const handleCopyDialogOpen = () => {
    if (selected.length > 0) {
      setCopyDialogOpen(true);
    }
  };

  const handleCopyDialogClose = () => setCopyDialogOpen(false);

  const handleDeleteSelectedSongs = async () => {
    if (selected.length > 0) {
      // Create an array of selected songs
      const selectedSongsArray = songs.filter((song) =>
        selected.includes(song.id)
      );
      setSelectedSongsForDeletion(selectedSongsArray); // Update the state
      setDeleteDialogOpen(true); // Open the delete confirmation dialog
    } else {
      alert("请勾选歌曲");
    }
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
  };

  const handleDeleteConfirmed = async () => {
    const failedDeletes: string[] = [];

    for (const songId of selected) {
      try {
        const response = await fetch(`http://localhost:5000/songs/${songId}`, {
          method: "DELETE",
        });
        getSongsForPlaylist();

        if (!response.ok) {
          failedDeletes.push(songId);
        }
      } catch (error) {
        console.error("Error deleting song:", error);
        failedDeletes.push(songId);
      }
    }

    if (failedDeletes.length === 0) {
      setSongs((prevSongs) =>
        prevSongs.filter((song) => !selected.includes(song.id))
      );
      setSelected([]);
      handleDeleteDialogClose(); // Close the delete confirmation dialog after successful deletes
    } else {
      console.error("Failed to delete some songs:", failedDeletes);
    }
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = songs.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleSingleSelect = (
    event: React.ChangeEvent<HTMLInputElement>,
    songId: string,
  ) => {
    if (event.target.checked) {
      setSelected((prev) => [...prev, songId]);
    } else {
      setSelected((prev) => prev.filter((localId) => localId !== songId));
    }
  };

  const getSongsForPlaylist = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/songs?playlistId=${id}`,
      );
      const songsData = await response.json();
      setSongs(songsData);
    } catch (error) {
      console.error("Error fetching songs:", error);
    }
  };

  const handleCopyToPlaylist = async () => {
    try {
      const failedCopies = [];

      for (const songId of selected) {
        const song = songs.find((s) => s.id === songId);
        if (song) {
          const copiedSong = {
            ...song,
            playlistId: selectedPlaylist,
            id: String(Math.random()),
          };

          try {
            const response = await fetch(`http://localhost:5000/songs`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(copiedSong),
            });

            if (!response.ok) {
              failedCopies.push(songId);
            }
          } catch (error) {
            console.error(`Error copying song with ID ${songId}:`, error);
            failedCopies.push(songId);
          }
        }
      }

      if (failedCopies.length === 0) {
        handleCopyDialogClose();
      } else {
        console.error("Failed to copy some songs:", failedCopies);
      }
    } catch (error) {
      console.error("Error copying songs:", error);
    }
  };

  useEffect(() => {
    fetch(`http://localhost:5000/playlists/${id}`)
      .then((response) => response.json())
      .then((data) => setPlaylist(data))
      .catch((error) => console.error("Error fetching playlist:", error));

    getSongsForPlaylist();

    fetch("http://localhost:5000/playlists")
      .then((response) => response.json())
      .then((data) => setPlaylists(data))
      .catch((error) => console.error("Error fetching playlists:", error));
  }, [id]);

  if (!playlist) return <div>Loading...</div>;

  return (
    <div>
      <img src={image} alt="" width={340} />
      <Link to="/">
        <HomeIcon color="primary" style={{ marginRight: "10px" }} />
      </Link>
      <Link to="/">返回播放列表</Link>
      <h2>{playlist.title}</h2>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <p>{playlist.description}</p>
        <div>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleAddDialogOpen}
          >
            Add Song
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleCopyDialogOpen}
            disabled={selected.length === 0}
          >
            Copy to Other Playlist
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleDeleteSelectedSongs}
          >
            Delete Selected Songs
          </Button>
        </div>
      </div>

      <AddSongDialog
        isOpen={addDialogOpen}
        onClose={handleAddDialogClose}
        onSongAdded={getSongsForPlaylist}
        playlistId={id || ""}
      />

      <Dialog open={copyDialogOpen} onClose={handleCopyDialogClose}>
        <DialogTitle>Copy to Other Playlist</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <InputLabel>Select Playlist</InputLabel>
            <Select
              value={selectedPlaylist}
              onChange={(e) => setSelectedPlaylist(e.target.value as string)}
            >
              {playlists.map((playlist) => (
                <MenuItem key={playlist.title} value={playlist.id}>
                  {playlist.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCopyDialogClose}>Cancel</Button>
          <Button onClick={handleCopyToPlaylist}>Copy</Button>
        </DialogActions>
      </Dialog>

      {/* Render the DeleteConfirmationDialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        onDeleteConfirmed={handleDeleteConfirmed}
        selectedSongs={selectedSongsForDeletion} // Pass the selected songs for deletion
      />

      <SongsTable
        songs={songs}
        selected={selected}
        handleSelectAllClick={handleSelectAllClick}
        handleSingleSelect={handleSingleSelect}
        onSongsUpdated={getSongsForPlaylist}
      />
    </div>
  );
}

export default PlaylistCardContent;
