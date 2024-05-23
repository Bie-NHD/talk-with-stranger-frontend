import {
  CallEnd,
  Camera,
  CameraAlt,
  Mic,
  MicOff,
  NoPhotography,
  PhoneDisabled,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Modal,
  Stack,
  Typography,
  styled,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import socket from "../../socket";
import { toast } from "react-toastify";
import Media from "../../utils/Media";
import { useSelector } from "react-redux";
import Peer from "peerjs";

const CallModal = ({ open, onClose }) => {
  const [loading, setLoading] = useState(false);
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const mediaObj = useRef();
  const [receiverInfo, setReceiverInfo] = useState();
  const [callSetting, setCallSetting] = useState({
    cam: true,
    mic: true,
  });
  const peerInstance = useRef();
  const currentUser = useSelector((state) => state.user.currentUser);

  useEffect(() => {
    (async () => {
      if (!open) {
        if (mediaObj.current) {
          mediaObj.current.clearStream();
          mediaObj.current = null;
        }
        if (localVideoRef.current?.srcObject) {
          localVideoRef.current.srcObject = null;
        }
        if (remoteVideoRef.current?.srcObject) {
          remoteVideoRef.current.srcObject = null;
        }
        setCallSetting({
          cam: true,
          mic: true,
        });
        if (peerInstance.current) {
          peerInstance.current.destroy();
          peerInstance.current = null;
        }
        return;
      }

      if (!mediaObj.current && localVideoRef.current && open) {
        mediaObj.current = new Media({ audio: true, video: true });
        await mediaObj.current.openStream();
        localVideoRef.current.srcObject = mediaObj.current.getStream();
      }
    })();

    //eslint-disable-next-line
  }, [open, localVideoRef.current, mediaObj.current]);

  useEffect(() => {
    if (!mediaObj.current) return;

    if (callSetting.cam) {
      mediaObj.current.openWebcam();
    } else {
      mediaObj.current.closeWebcam();
    }

    if (callSetting.mic) {
      mediaObj.current.openMic();
    } else {
      mediaObj.current.muteMic();
    }
  }, [callSetting.mic, callSetting.cam, mediaObj]);

  useEffect(() => {
    socket.on("call/waiting", (receiverInfo) => {
      setLoading(true);
      setReceiverInfo(receiverInfo);
    });

    socket.on("call/accepted", (receiverInfo) => {
      setLoading(false);
      if (!peerInstance.current) {
        peerInstance.current = new Peer();

        peerInstance.current.on("open", (id) => {
          const call = peerInstance.current.call(
            receiverInfo.peerId,
            mediaObj.current.getStream()
          );

          call.on("stream", function (stream) {
            remoteVideoRef.current.srcObject = stream;
          });
        });
      }
    });

    socket.on("call/rejected", (receiver) => {
      setLoading(false);
      toast.info(
        `${receiver.user_first_name} ${receiver.user_last_name} rejected the call`,
        {
          position: "top-center",
        }
      );
      onClose();
    });

    socket.on("call/ended", () => {
      setLoading(false);
      toast.info(`Call ended`, {
        position: "top-center",
      });
      onClose();
    });

    return () => {
      socket.off("call/waiting");
      socket.off("call/rejected");
      socket.off("call/accepted");
      socket.off("call/ended");
    };
  }, [onClose, currentUser.id]);

  const handleToggleCam = () => {
    setCallSetting((prev) => ({ ...prev, cam: !prev.cam }));
  };

  const handleCancelCall = () => {
    socket.emit("call/cancel", receiverInfo.id);
    onClose();
  };

  const handleToggleMic = () => {
    setCallSetting((prev) => ({ ...prev, mic: !prev.mic }));
  };

  const handleEndCall = () => {
    socket.emit("call/end", receiverInfo.id);
    onClose();
  };

  return (
    <Modal open={open}>
      <Box
        sx={{
          borderRadius: 5,
          width: "80vw",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            display: "flex",
            height: "70vh",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <video
            muted
            ref={localVideoRef}
            style={{
              width: "50%",
              height: "100%",
              bgcolor: "red",
              objectFit: "cover",
              objectPosition: "center",
            }}
            playsInline
            autoPlay
          >
            Your browser doesn't support video
          </video>

          <Box
            sx={{
              width: "50%",
              height: "100%",
              position: "relative",
              bgcolor: "#cccccc",
              zIndex: 1000,
            }}
          >
            <video
              muted
              ref={remoteVideoRef}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
                position: "absolute",
                top: 0,
                left: 0,
              }}
              playsInline
              autoPlay
            >
              Your browser doesn't support video
            </video>
            {loading && (
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <Typography mb={2} variant="body2">
                  Waiting for {receiverInfo?.fullName} to response...
                </Typography>
                <Avatar
                  src={receiverInfo?.avatar}
                  sx={{
                    width: "100px",
                    height: "100px",
                    position: "relative",
                  }}
                />
                <Typography mt={2} variant="h5">
                  {receiverInfo?.fullName}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        <Stack
          direction="row"
          spacing={5}
          sx={{
            width: "100%",
            p: 2,
            bgcolor: "rgba(0,0,0,0.2)",
          }}
        >
          {!loading && (
            <Button
              onClick={handleEndCall}
              variant="contained"
              color="error"
              startIcon={<CallEnd />}
            >
              End call
            </Button>
          )}
          {loading && (
            <Button
              onClick={handleCancelCall}
              variant="contained"
              color="error"
              startIcon={<PhoneDisabled />}
            >
              Cancel call
            </Button>
          )}
          <IconButton size="large" color="info" onClick={handleToggleCam}>
            {callSetting.cam && <CameraAlt />}
            {!callSetting.cam && <NoPhotography />}
          </IconButton>
          <IconButton size="large" color="info" onClick={handleToggleMic}>
            {callSetting.mic && <Mic />}
            {!callSetting.mic && <MicOff />}
          </IconButton>
        </Stack>
      </Box>
    </Modal>
  );
};

export default CallModal;
