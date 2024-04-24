import { Call, Female, Flag, Male } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import moment from "moment";
import React, { useMemo } from "react";

const AVATAR_SIZE = 5;

const ChatInfoHeader = ({
  userAvatar,
  userName,
  gender,
  userId,
  dob,
  onUnfriendClick,
  onCallClick,
}) => {
  const calculateAge = useMemo(() => {
    if (!dob) return "unknown";

    return moment().diff(moment(dob), "years");
  }, [dob]);

  return (
    <Box
      sx={{
        width: "100%",
        height: "30%",
        p: 1,
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Avatar
        sx={{
          width: `${AVATAR_SIZE}rem`,
          height: `${AVATAR_SIZE}rem`,
          textAlign: "center",
        }}
        src={userAvatar}
      >{`${userName.split(" ")[0].charAt(0).toUpperCase()} ${userName
        .split(" ")[1]
        .charAt(0)
        .toUpperCase()}`}</Avatar>

      <Stack direction="row" sx={{ alignItems: "center", mt: 1 }} spacing={1}>
        <Typography variant="h6">
          {userName} ({calculateAge})
        </Typography>
        {gender === "male" && <Male />}
        {gender === "female" && <Female />}
      </Stack>
      {/* <Button
        onClick={onUnfriendClick}
        sx={{ marginTop: "auto" }}
        variant="contained"
        color="error"
      >
        Unfriend
      </Button> */}
      {/* <IconButton color="info" onClick={() => onCallClick(userId)}>
        <Call />
      </IconButton> */}
    </Box>
  );
};

export default ChatInfoHeader;
