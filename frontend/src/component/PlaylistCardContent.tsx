import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import image from "../public/image.png";
import SongsTable from "./SongsTable";
import AddSongDialog from "./AddSongDialog";
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

type Song = {
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
  const [copyDialogOpen, setCopyDialogOpen] = useState(false); // State for "Copy to Other Playlist" dialog
  const [playlists, setPlaylists] = useState<Playlist[]>([]); // State to store existing playlists
  const [selectedPlaylist, setSelectedPlaylist] = useState(""); // State to store selected playlist for copying

  const handleCopyDialogOpen = () => {
    if (selected.length > 0) {
      // Open the "Copy to Other Playlist" dialog only when songs are selected
      setCopyDialogOpen(true);
    }
  };

  const handleCopyDialogClose = () => setCopyDialogOpen(false);

  const handleDeleteSelectedSongs = async () => {
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
            id: String(Math.random()), // Generate a new ID for the copied song
          };

          try {
            // Send a POST request to create a new song with the copied data
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
        handleCopyDialogClose(); // Close the dialog after successful copies
      } else {
        console.error("Failed to copy some songs:", failedCopies);
      }
    } catch (error) {
      console.error("Error copying songs:", error);
    }
  };

  // const handleSaveEdit = () => {
  //   getSongsForPlaylist(); // Refresh songs after edit.
  // };

  useEffect(() => {
    fetch(`http://localhost:5000/playlists/${id}`)
      .then((response) => response.json())
      .then((data) => setPlaylist(data))
      .catch((error) => console.error("Error fetching playlist:", error));

    getSongsForPlaylist();

    // Fetch existing playlists when the component mounts
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
            disabled={selected.length === 0}
          >
            Delete Selected Songs
          </Button>
        </div>
      </div>

      <AddSongDialog
        isOpen={addDialogOpen}
        onClose={handleAddDialogClose}
        onSongAdded={getSongsForPlaylist}
        playlistId={id || ""} // <-- Pass the playlist id here
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
