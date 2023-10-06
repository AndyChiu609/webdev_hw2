import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import image from "../public/image.png";
import SongsTable from "./SongsTable";
import AddSongDialog from "./AddSongDialog";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";

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
  const [copyDialogOpen, setCopyDialogOpen] = useState(false);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSongsForDeletion, setSelectedSongsForDeletion] = useState<
    Song[]
  >([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");

  const handleAddDialogOpen = () => setAddDialogOpen(true);
  const handleAddDialogClose = () => setAddDialogOpen(false);

  const handleCopyDialogOpen = () => {
    if (selected.length > 0) {
      setCopyDialogOpen(true);
    }
  };

  const handleEditDialogOpen = () => {
    if (playlist) {
      setEditedTitle(playlist.title);
      setEditedDescription(playlist.description);
      setEditDialogOpen(true);
    }
  };

  const handleEditDialogClose = () => setEditDialogOpen(false);

  const handleCopyDialogClose = () => setCopyDialogOpen(false);

  const handleDeleteSelectedSongs = async () => {
    if (selected.length > 0) {
      const selectedSongsArray = songs.filter((song) =>
        selected.includes(song.id),
      );
      setSelectedSongsForDeletion(selectedSongsArray);
      setDeleteDialogOpen(true);
    } else {
      alert("请勾选歌曲");
    }
  };

  const handleDeleteDialogClose = () => setDeleteDialogOpen(false);

  const handleSaveEdit = async () => {
    try {
      const response = await fetch(`http://localhost:5000/playlists/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editedTitle,
          description: editedDescription,
        }),
      });

      if (response.ok) {
        setPlaylist((prevPlaylist) => ({
          ...prevPlaylist!,
          title: editedTitle,
          description: editedDescription,
          id: prevPlaylist?.id || "",
        }));
        handleEditDialogClose();
      } else {
        console.error("Failed to update playlist data");
      }
    } catch (error) {
      console.error("Error updating playlist:", error);
    }
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
        prevSongs.filter((song) => !selected.includes(song.id)),
      );
      setSelected([]);
      handleDeleteDialogClose();
    } else {
      console.error("Failed to delete some songs:", failedDeletes);
    }
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = songs.map((n) => n.id);
      setSelected(newSelected);
    } else {
      setSelected([]);
    }
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
          <Button
            variant="outlined"
            color="primary"
            onClick={handleEditDialogOpen}
          >
            Edit Title and Description
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

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        onDeleteConfirmed={handleDeleteConfirmed}
        selectedSongs={selectedSongsForDeletion}
      />

      <SongsTable
        songs={songs}
        selected={selected}
        handleSelectAllClick={handleSelectAllClick}
        handleSingleSelect={handleSingleSelect}
        onSongsUpdated={getSongsForPlaylist}
      />

      <Dialog open={editDialogOpen} onClose={handleEditDialogClose}>
        <DialogTitle>Edit Title and Description</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            fullWidth
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
          />
          <TextField
            label="Description"
            fullWidth
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose}>Cancel</Button>
          <Button onClick={handleSaveEdit} color="primary">
            Save Edit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default PlaylistCardContent;
