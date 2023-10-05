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

type Song = {
  id: string;
  songName: string;
  singer: string;
  link: string;
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
      await fetch(`http://localhost:5000/songs/${editingSong.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingSong),
      });
      closeEditDialog();

      if (onSongsUpdated) {
        onSongsUpdated();
      }
    }
  };

  const isSongSelected = (songId: string) => selected.indexOf(songId) !== -1;

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
              <TableRow key={row.id}>
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    checked={isSongSelected(row.id)}
                    onChange={(e) => handleSingleSelect(e, row.id)}
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
