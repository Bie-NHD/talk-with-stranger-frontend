import React from "react";
import { Grid, Avatar, Typography, Button, Stack } from "@mui/material";
import FriendRequestService from "../../services/friendRequest.service";
import { useSelector } from "react-redux";
import { PersonAdd } from "@mui/icons-material";

const FriendRequestItem = ({
  userName,
  greetingText,
  userAvatar,
  friendRequestId,
  onFriendRequestAccept,
  onFriendRequestReject,
}) => {
  return (
    <Grid container sx={{ p: 0, display: "flex", justifyContent: "center" }}>
      <Grid sx={{ display: "flex", justifyContent: "center" }} xs={2} item>
        <Avatar src={userAvatar} sx={{ width: "70px", height: "70px" }}>
          TT
        </Avatar>
      </Grid>
      <Grid xs={8} item>
        <Typography variant="h5">{userName}</Typography>
        <Typography variant="body1">{greetingText}</Typography>
      </Grid>
      <Grid xs={2} item>
        <Stack spacing={1}>
          <Button
            onClick={() => onFriendRequestReject(friendRequestId)}
            sx={{
              bgcolor: "#959c97",
              "&:hover": {
                bgcolor: "#959c97",
              },
            }}
            variant="contained"
          >
            Reject
          </Button>
          <Button
            onClick={() => onFriendRequestAccept(friendRequestId)}
            variant="contained"
          >
            Accept
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default FriendRequestItem;
