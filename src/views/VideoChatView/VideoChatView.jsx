import {
  Backdrop,
  Box,
  CircularProgress,
  Divider,
  Grid,
  LinearProgress,
  Typography,
  IconButton,
} from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import VideoController from "../../components/VideoController/VideoController";
import ChatBar from "../../components/Chat/ChatBar/ChatBar";
import { ChatInput } from "../../components/Chat";
import useMedia from "../../hooks/useMedia";
import usePeer from "../../hooks/usePeer";
import socket from "../../socket/index";
import { useSelector } from "react-redux";
import FriendRequestService from "../../services/friendRequest.service";
import FriendRequestModal from "../../components/FriendRequestModal/FriendRequestModal";
import { toast } from "react-toastify";

const VideoChatView = () => {
  const remoteVideoRef = useRef(null);
  const localVideoRef = useRef();
  const [conservation, setConservation] = useState(null);
  const [messages, setMessages] = useState([]);
  const callRef = useRef(null);
  const [remoteInfo, setRemoteInfo] = useState(undefined);
  const currentUser = useSelector((state) => state.user.currentUser);
  const tokens = useSelector((state) => state.user.userToken);
  const [friendModalOpen, setFriendModalOpen] = useState(false);
  const [
    localVolume,
    setLocalOptions,
    localOptions,
    localStream,
    devicesLoading,
  ] = useMedia(
    {
      audio: true,
      video: true,
    },
    localVideoRef
  );

  const [peerInstance, peerInitiating] = usePeer((call) => {
    call.answer(localStream);

    call.on("stream", (remoteStream) => {
      remoteVideoRef.current.srcObject = remoteStream;
    });

    call.on("close", () => {
      setConservation(null);
      setMessages([]);
      callRef.current = null;
    });

    callRef.current = call;
  });

  const callRemotePeer = useCallback(
    (peerId) => {
      const call = peerInstance.call(peerId, localStream);

      const handleStreamingCall = (remoteStream) => {
        remoteVideoRef.current.srcObject = remoteStream;
      };

      const handleCallClose = () => {
        if (conservation) {
          socket.emit("conservation/leave", {
            roomId: conservation.roomId,
          });
        }
        setConservation(null);
        setMessages([]);
        callRef.current = null;
      };

      call.on("stream", handleStreamingCall);
      call.on("close", handleCallClose);
      callRef.current = call;

      return () => {
        if (call) {
          call.off("stream", handleStreamingCall);
          call.off("close", handleCallClose);
        }
      };
    },
    [peerInstance, localStream, conservation]
  );

  const [callLoading, setCallLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (callRef.current) {
        callRef.current.close();
      }
      setRemoteInfo(undefined);
      socket.emit("conservation/cancelFind", currentUser.id);
    };
  }, [currentUser.id]);

  useEffect(() => {
    if (conservation) {
      setRemoteInfo(
        conservation.caller.userId === currentUser.id
          ? conservation.receiver
          : conservation.caller
      );
    } else {
      setRemoteInfo(undefined);
    }
  }, [conservation, currentUser]);

  useEffect(() => {
    socket.on("conservation/founding", () => {
      setCallLoading(true);
    });
    socket.on("conservation/founded", (data) => {
      setCallLoading(false);
      setConservation(data);
      if (data.caller.userId === currentUser.id) {
        callRemotePeer(data.receiver.peerId);
      }
    });

    socket.on(
      "message/new",
      ({ text, senderId, sendAt, userName, senderAvt }) => {
        setMessages((prev) => [
          ...prev,
          {
            text: text?.chatMessageInput,
            isSender: currentUser.id === senderId,
            sendAt,
            userName,
            avatar: senderAvt,
          },
        ]);
      }
    );

    return () => {
      socket.off("conservation/founding");
      socket.off("message/new");
      socket.off("conservation/founded");
    };
  }, [peerInstance, currentUser.id, localStream, callRemotePeer]);

  const handleMicTonggle = () => {
    setLocalOptions((prev) => {
      const prevAudio = prev.audio;
      return { ...prev, audio: !prevAudio };
    });
  };

  const handleCameraTonggle = () => {
    setLocalOptions((prev) => {
      const prevVideo = prev.video;
      return { ...prev, video: !prevVideo };
    });
  };

  const handleSkipBtnClick = async () => {
    if (callRef.current) {
      await callRef.current.close();
    }

    socket.emit("conservation/findRandom", {
      userId: currentUser.id,
      userName: `${currentUser.user_first_name}${currentUser.user_last_name}`,
      userAvatarUrl: currentUser.user_avatar,
      userCountry: currentUser?.user_country,
      peerId: peerInstance.id,
    });
  };

  const handleMessageSend = (message, setValue) => {
    if (!conservation) return;

    socket.emit("message/create", {
      text: message,
      senderId: currentUser.id,
      sendAt: Date.now(),
      roomId: conservation.roomId,
      senderAvt: currentUser.user_avatar,
      userName: `${currentUser.user_first_name} ${currentUser.user_last_name}`,
    });

    setValue("chatMessageInput", "");
  };

  const handleVolumeChange = (_, newValue) => {
    localVideoRef.current.volume = newValue / 100;
  };

  const handleAddFriend = async ({ greetingText }) => {
    if (conservation && conservation?.receiver) {
      const frs = new FriendRequestService(
        `${import.meta.env.VITE_BASE_URL}/api/v1`
      );

      try {
        await frs.sendFriendRequest({
          uid: currentUser.id,
          tokens,
          receiverId: remoteInfo.userId,
          greetingText: greetingText.trim(),
        });
      } catch (err) {
        toast.error(err.message);
      }
    }
  };

  const handleFriendModalClose = () => {
    setFriendModalOpen(false);
  };

  const handleMenuItemClick = async (actionType) => {
    switch (actionType) {
      case "ADD_FRIEND":
        setFriendModalOpen(true);
        break;
      default:
        return;
    }
  };

  return (
    <>
      <FriendRequestModal
        open={friendModalOpen}
        onClose={handleFriendModalClose}
        onSubmit={handleAddFriend}
      />
      <Box
        component="div"
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "calc(100vh - 96px)",
        }}
      >
        <Box sx={{ height: "50%" }}>
          <Grid container spacing={1} height="100%">
            <Grid sx={{ position: "relative" }} item xs={6}>
              <VideoController
                loading={devicesLoading || peerInitiating}
                options={localOptions}
                onMicBtnClick={handleMicTonggle}
                onCameraBtnClick={handleCameraTonggle}
                onVolumeChange={handleVolumeChange}
                ref={localVideoRef}
                onSkipBtnClick={handleSkipBtnClick}
                volume={localVolume}
                fullControl
                userInfo={{
                  userName: `${currentUser.user_first_name} ${currentUser.user_last_name}`,
                  userAvatarUrl: currentUser.user_avatar,
                  userCountry: currentUser?.user_country,
                }}
              />
            </Grid>
            <Grid item xs={6} sx={{ position: "relative" }}>
              <VideoController
                menu={[{ actionType: "ADD_FRIEND", label: "Add friend" }]}
                onMenuItemClick={handleMenuItemClick}
                userInfo={
                  remoteInfo && {
                    userName: remoteInfo?.userName,
                    userAvatarUrl: remoteInfo?.userAvatarUrl,
                    userCountry: remoteInfo?.userCountry,
                  }
                }
                screenLoading={callLoading}
                ref={remoteVideoRef}
              />
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ height: "40%", overflow: "auto" }}>
          <ChatBar messages={messages} />
        </Box>
        <Box sx={{ height: "10%" }}>
          <Divider />
          <ChatInput
            disabled={!conservation}
            onMessageSend={handleMessageSend}
          />
        </Box>
      </Box>
    </>
  );
};

export default VideoChatView;
