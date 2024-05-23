import { Box, CircularProgress, Divider, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import ChatInfoHeader from "../ChatInfo/ChatInfoHeader";
import ConservationChatBar from "../ConservationChatBar/ConservationChatBar";
import socket from "../../../socket/index";
import MessagesList from "../MessagesList/MessagesList";
import MessageService from "../../../services/messages.service";
import { useSelector } from "react-redux";
import ConfirmDialog from "../../ConfirmDialog/ConfirmDialog";
import FriendService from "../../../services/friend.service.js";
import { toast } from "react-toastify";
import CallModal from "../../CallModal/CallModal.jsx";

const ConservationChatRoom = ({ conservation }) => {
  const { userData, conservation: conservationData } = conservation;
  const [messages, setMessages] = useState([]);
  const currentUserId = useSelector((state) => state.user.currentUser.id);
  const currentUser = useSelector((state) => state.user.currentUser);
  const tokens = useSelector((state) => state.user.userToken);
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [callModalOpen, setCallModalOpen] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const messageService = new MessageService(
        `${import.meta.env.VITE_BASE_URL}/api/v1`
      );

      const messages = await messageService.getMessages({
        uid: currentUserId,
        tokens,
        conservationId: conservationData.id,
        page: 1,
        limit: 500,
      });

      const modifiedData = messages.metadata.data.map((m) => ({
        ...m,
        isSender: m.sender.id === currentUserId,
      }));

      setMessages(modifiedData);
      setLoading(false);
    })();
  }, [conservation]);

  useEffect(() => {
    socket.emit("conservation/setup", conservationData.id);
    socket.on("conservation/newMessage", (newMess) => {
      const modifiedData = {
        ...newMess,
        isSender: newMess.sender.id === currentUserId,
      };
      setMessages((prev) => [...prev, modifiedData]);
    });

    return () => {
      socket.emit("conservation/leaveChatRoom", conservationData.id);
      socket.off("conservation/newMessage");
    };
  }, [conservation]);

  const handleSendMessage = async (data, setValue) => {
    const messageService = new MessageService(
      `${import.meta.env.VITE_BASE_URL}/api/v1`
    );

    await messageService.sendMessage({
      uid: currentUserId,
      tokens,
      conservationId: conservationData.id,
      body: {
        type: "text",
        text: data.chatMessageInput,
      },
    });

    setValue("chatMessageInput", "");
  };

  const handleUnfriendBtnClicked = () => {
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
  };

  const handleUnfriend = async (type) => {
    if (type === "YES") {
      const friendService = new FriendService(
        `${import.meta.env.VITE_BASE_URL}/api/v1`
      );

      try {
        await friendService.unFriend({
          uid: currentUserId,
          tokens: tokens,
          friendId: userData.id,
        });
        toast.success("Unfriend successfully");
      } catch (err) {
        toast.error(err.message);
      }
    }
    setShowDialog(false);
  };

  const handleCall = (userId) => {
    socket.emit("call/create", {
      caller: currentUser,
      receiver: userData,
    });

    setCallModalOpen(true);
  };

  return (
    <>
      <CallModal
        open={callModalOpen}
        onClose={() => setCallModalOpen(false)}
        caller
      />
      <ConfirmDialog
        onActions={handleUnfriend}
        open={showDialog}
        onClose={handleCloseDialog}
        dialogTitle="Are you sure you want to unfriend"
        actions={[
          {
            type: "NO",
            label: "No",
          },
          {
            type: "YES",
            label: "Yes",
            color: "error",
          },
        ]}
      />
      <Grid sx={{ width: "100%", height: "100%", p: 1 }} container>
        <Grid item xs={9}>
          <Box sx={{ width: "100%", height: "100%", position: "relative" }}>
            {loading && <CircularProgress />}
            {!loading && (
              <MessagesList
                sx={{
                  py: 2,
                  position: "absolute",
                  bottom: 30,
                  height: "100%",
                  pr: 1,
                  left: 0,
                  right: 0,
                  overflowY: "auto",
                  "&::-webkit-scrollbar": {
                    width: "0.3em",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: (theme) => theme.palette.divider,
                    borderRadius: "100vmax",
                  },
                }}
                messages={messages}
              />
            )}
            <ConservationChatBar
              onMessageSend={handleSendMessage}
              disabled={loading}
              sx={{
                height: "50px",
                position: "absolute",
                bottom: -10,
                pr: 1,
                left: 0,
                right: 0,
                width: "100%",
              }}
            />
          </Box>
        </Grid>
        <Grid
          sx={{ borderLeft: (theme) => `1px solid ${theme.palette.divider}` }}
          item
          xs={3}
        >
          <ChatInfoHeader
            userAvatar={userData.avatar}
            userName={userData.fullName}
            gender={userData.gender}
            dob={userData.dob}
            onUnfriendClick={handleUnfriendBtnClicked}
            onCallClick={handleCall}
            userId={userData.id}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default ConservationChatRoom;
