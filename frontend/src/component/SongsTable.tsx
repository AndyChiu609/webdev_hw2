import React, { useState } from "react";
import {
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import axios from "axios";

type Song = {
  _id: string;
  songName: string;
  singer: string;
  link: string;
  playlistId: string;
};

type SongsTableProps = {
  songs: Song[];
  handleSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSingleSelect: (
    event: React.ChangeEvent<HTMLInputElement>,
    id: string,
  ) => void;
  onSongsUpdated: () => void;
  selected?: readonly string[];
};

const SongsTable: React.FC<SongsTableProps> = ({
  songs,
  handleSelectAllClick,
  handleSingleSelect,
  onSongsUpdated,
  selected = [],
}) => {
  const [editingSong, setEditingSong] = useState<Song | null>(null);

  const openEditDialog = (song: Song) => {
    setEditingSong(song);
  };

  const closeEditDialog = () => {
    setEditingSong(null);
  };

  const handleSaveEdit = async () => {
    if (editingSong) {
      try {
        console.log(editingSong._id);
        const response = await axios.put(
          `http://localhost:8000/api/songs/${editingSong._id}`,
          editingSong
        );
  
        // Check if the response has any data or specific messages
        if (response.data) {
          console.log("Response data:", response.data);
        }
  
        // Close the edit dialog
        closeEditDialog();
  
        // If provided, call the onSongsUpdated callback to refresh the songs
        if (onSongsUpdated) {
          onSongsUpdated();
        }
      } catch (error) {
        console.error("Error updating song:", error);
  
        if (error instanceof Error) {
          console.error("Error message:", error.message);
        } else if (axios.isAxiosError(error)) {
          console.error("Axios error:", error);
  
          if (error.response) {
            console.error("Error status:", error.response.status);
            console.error("Error data:", error.response.data);
            console.error("Error headers:", error.response.headers);
          } else if (error.request) {
            console.error("No response received:", error.request);
          }
        } else {
          console.error("Unknown error:", error);
        }
  
        alert("Failed to update the song. Check the console for more details.");
      }
    }
  };
  
  


  

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={songs.length > 0 && songs.length === selected.length}
                  onChange={handleSelectAllClick}
                  color="primary"
                  inputProps={{
                    "aria-label": "select all songs",
                  }}
                />
              </TableCell>
              <TableCell>Song</TableCell>
              <TableCell align="right">Singer</TableCell>
              <TableCell align="right">Link</TableCell>
              <TableCell>Edit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {songs.map((row) => (
              <TableRow key={row._id}>
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    checked={selected.includes(row._id)}
                    onChange={(e) => {
                      // Handle single select
                      handleSingleSelect(e, row._id);
                    }}
                  />
                </TableCell>
                <TableCell>{row.songName}</TableCell>
                <TableCell align="right">{row.singer}</TableCell>
                <TableCell align="right">
                  <a href={row.link} target="_blank" rel="noopener noreferrer">
                    {row.link}
                  </a>
                </TableCell>
                <TableCell>
                  <Button onClick={() => openEditDialog(row)}>Edit</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Dialog */}
      <Dialog open={!!editingSong} onClose={closeEditDialog}>
        <DialogTitle>Edit Song</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Song Name"
            value={editingSong?.songName}
            onChange={(e) =>
              setEditingSong((prev) =>
                prev ? { ...prev, songName: e.target.value } : null,
              )
            }
          />
          <TextField
            fullWidth
            label="Singer"
            value={editingSong?.singer}
            onChange={(e) =>
              setEditingSong((prev) =>
                prev ? { ...prev, singer: e.target.value } : null,
              )
            }
          />
          <TextField
            fullWidth
            label="Link"
            value={editingSong?.link}
            onChange={(e) =>
              setEditingSong((prev) =>
                prev ? { ...prev, link: e.target.value } : null,
              )
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditDialog}>Cancel</Button>
          <Button color="primary" onClick={handleSaveEdit}>
            Save Edit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SongsTable;
