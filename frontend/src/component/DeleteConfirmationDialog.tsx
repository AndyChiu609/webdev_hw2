import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

import { Song } from "./PlaylistCardContent";

type DeleteConfirmationDialogProps = {
  open: boolean;
  onClose: () => void;
  onDeleteConfirmed: () => void;
  selectedSongs: Song[]; // 传入被选中的歌曲信息
};

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  open,
  onClose,
  onDeleteConfirmed,
  selectedSongs,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>确认删除</DialogTitle>
      <DialogContent>
        <DialogContentText>
          确定要删除以下歌曲吗？
          <ul>
            {selectedSongs.map((song) => (
              <li key={song.id}>
                歌名{song.songName} - 歌手{song.singer} - 歌曲連結{song.link}
              </li>
            ))}
          </ul>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          取消
        </Button>
        <Button onClick={onDeleteConfirmed} color="primary">
          确定删除
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
