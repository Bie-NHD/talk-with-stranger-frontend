import { Box, Typography } from "@mui/material";
import React, { useEffect, useRef } from "react";
import ChatMessageItem from "../ChatMessageItem/ChatMessageItem";
import { forwardRef } from "react";

const MessagesList = forwardRef(({ messages, sx }, ref) => {
  const bottomEl = useRef();

  useEffect(() => {
    bottomEl.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Box component="div" id="messContainer" sx={sx}>
      <div ref={ref}></div>
      {messages?.length <= 0 && (
        <Typography>You haven't had any messages</Typography>
      )}
      {messages?.length > 0 &&
        messages.map((mess) => (
          <ChatMessageItem
            sendAt={mess.createdAt}
            wrapperSx={{ marginTop: "15px" }}
            key={mess.id}
            messageRight={!mess.isSender}
            active={mess.isSender}
            text={mess.text}
            username={`${mess.sender.user_first_name} ${mess.sender.user_last_name}`}
            avatarSrc={mess.sender.user_avatar}
          />
        ))}
      <div ref={bottomEl}></div>
    </Box>
  );
});

export default MessagesList;
