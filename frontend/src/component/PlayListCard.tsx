import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

type PlaylistCardProps = {
  title: string;
  image: string;
  id: string;
  deleteMode: boolean;
  onDelete: () => void;
};

export default function PlaylistCard({
  title,
  image,
  id,
  deleteMode,
  onDelete,
}: PlaylistCardProps) {
  const navigate = useNavigate();
  const [songCount, setSongCount] = useState<number>(0);

  // Function to fetch and count songs for the playlist
  const fetchAndCountSongs = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/songs?playlistId=${id}`,
      );
      if (response.ok) {
        const songs = await response.json();
        setSongCount(songs.length);
      } else {
        console.error("Failed to fetch songs:", response.status);
      }
    } catch (error) {
      console.error("Error fetching songs:", error);
    }
  };

  useEffect(() => {
    fetchAndCountSongs();
  }, [id]);

  return (
    <Card sx={{ maxWidth: 345, position: "relative" }}>
      {/* Display the close icon only if deleteMode is true */}
      {deleteMode && (
        <CloseIcon
          style={{
            color: "red",
            position: "absolute",
            top: "10px",
            right: "10px",
            cursor: "pointer",
            zIndex: 1,
          }}
          onClick={(e) => {
            e.stopPropagation(); // Prevent CardActionArea's navigate action
            onDelete();
          }}
        />
      )}

      <CardActionArea onClick={() => navigate(`/playlist/${id}`)}>
        <CardMedia component="img" height="250" image={image} alt={title} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Song count: {songCount}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
