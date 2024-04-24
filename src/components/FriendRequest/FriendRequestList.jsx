import React from "react";
import { Stack, Typography, CircularProgress } from "@mui/material";
import FriendRequestItem from "./FriendRequestItem";

const FriendRequestList = ({
  data,
  loading,
  onFriendRequestAccept,
  onFriendRequestReject,
}) => {
  return (
    <Stack
      sx={{ boxShadow: 1, width: "60%", borderRadius: 2, p: 2 }}
      spacing={5}
    >
      {loading && <CircularProgress />}
      {data.length <= 0 && (
        <Typography variant="h6" component="h2">
          You hasn't had any friend requests yet
        </Typography>
      )}
      {data.length > 0 &&
        data?.map((it) => (
          <>
            <FriendRequestItem
              key={it.id}
              onFriendRequestAccept={onFriendRequestAccept}
              onFriendRequestReject={onFriendRequestReject}
              userName={`${it.sender.user_first_name} ${it.sender.user_last_name}`}
              greetingText={it.greeting_text}
              userAvatar={it.sender.user_avatar}
              friendRequestId={it.id}
            />
          </>
        ))}
    </Stack>
  );
};

export default FriendRequestList;
