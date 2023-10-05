import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import image from "../public/image.png";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import { TextField } from "@mui/material";

type Playlist = {
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

  const [editted, setEditted] = useState<Song[]>([]);

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
    id: string,
  ) => {
    if (event.target.checked) {
      setSelected((prev) => [...prev, id]);
      setEditted([songs.find((row) => row.id === id)!] ?? []);
    } else {
      setSelected((prev) => prev.filter((localId) => localId !== id));
    }
  };

  const getSongsForPlaylist = async (playlistID: string): Promise<void> => {
    const response = await fetch(`http://localhost:5000/songs`);
    const songsData = await response.json();

    setSongs(songsData[playlistID] || []);
  };

  useEffect(() => {
    fetch(`http://localhost:5000/playlists/${id}`)
      .then((response) => response.json())
      .then((data) => setPlaylist(data))
      .catch((error) => console.error("Error fetching playlist:", error));

    getSongsForPlaylist(id ?? "");
  }, [id]);

  if (!playlist) return <div>Loading...</div>;

  return (
    <div>
      <img src={image} alt="" width={340} />
      <h2>{playlist.title}</h2>
      <p>{playlist.description}</p>
      {/* <ul>
    {songs?.map((song)=><li>{song.songName}</li>)}
    </ul> */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  onChange={handleSelectAllClick}
                  color="primary"
                  // indeterminate={numSelected > 0 && numSelected < rowCount}
                  // checked={rowCount > 0 && numSelected === rowCount}
                  // onChange={onSelectAllClick}
                  inputProps={{
                    "aria-label": "select all desserts",
                  }}
                />
              </TableCell>
              <TableCell>Song</TableCell>
              <TableCell align="right">Singer</TableCell>
              <TableCell align="right">Link</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {songs.map((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    checked={selected.some((id) => row.id === id)}
                    onChange={(e) => handleSingleSelect(e, row.id)}
                  />
                </TableCell>
                {selected.some((id) => row.id === id) ? (
                  <>
                    <TableCell>
                      <TextField
                        value={
                          editted.find((obj) => obj.id === row.id)?.songName
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={editted.find((obj) => obj.id === row.id)?.singer}
                      />
                    </TableCell>
                    <TableCell>
                      {" "}
                      <TextField
                        value={editted.find((obj) => obj.id === row.id)?.link}
                      />
                    </TableCell>
                  </>
                ) : (
                  <>
                    <TableCell>{row.songName}</TableCell>
                    <TableCell align="right">{row.singer}</TableCell>
                    <TableCell align="right">
                      <a href={row.link} target="_blank">
                        {row.link}
                      </a>
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box display="flex" gap={2} mt={2} justifyContent="center">
        <Button variant="contained" color="primary">
          add
        </Button>
        <Button variant="outlined" color="secondary">
          delete
        </Button>
      </Box>
      <Link to="/">返回播放列表</Link>
    </div>
  );
}

export default PlaylistCardContent;
