import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

type PlaylistCardProps = {
  title: string;
  description: string;
  image: string;
  id: string;
  deleteMode: boolean;
  onDelete: () => void;
};

export default function PlaylistCard({
  title,
  description,
  image,
  id,
  deleteMode,
  onDelete,
}: PlaylistCardProps) {
  const navigate = useNavigate();

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
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
