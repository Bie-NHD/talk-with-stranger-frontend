import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

const FriendRequestModal = ({ open, onClose, onSubmit }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        component: "form",
        onSubmit: (e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const formJson = Object.fromEntries(formData.entries());
          onSubmit(formJson);
          onClose();
        },
      }}
    >
      <DialogTitle>Add friend</DialogTitle>
      <DialogContent>
        <TextField
          sx={{ width: "clamp(200px, 300px, 500px)" }}
          autoFocus
          margin="dense"
          name="greetingText"
          label="Greeting text"
          type="text"
          fullWidth
          defaultValue="Hello, want to make friend?"
          variant="standard"
        />
      </DialogContent>
      <DialogActions>
        <Button sx={{ width: "30%" }} variant="contained" onClick={onClose}>
          Cancel
        </Button>
        <Button sx={{ width: "70%" }} variant="contained" type="submit">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FriendRequestModal;
