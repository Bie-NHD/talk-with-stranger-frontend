import {
  CallEnd,
  CameraAlt,
  Mic,
  MicOff,
  NoPhotography,
  PhoneDisabled,
} from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import socket from "../../socket";
import Media from "../../utils/Media";
import Peer from "peerjs";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const CallModalReceiver = ({ open, onClose, callerInfo }) => {
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const mediaObj = useRef();
  const peerInstance = useRef();
  const [callSetting, setCallSetting] = useState({ cam: true, mic: true });
  const currentUser = useSelector((state) => state.user.currentUser);
  const [callInitiating, setCallInitiating] = useState(false);

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
        if (peerInstance.current) {
          peerInstance.current.destroy();
          peerInstance.current = null;
        }
        setCallSetting({ cam: true, mic: true });
        return;
      }

      if (
        !mediaObj.current &&
        localVideoRef.current &&
        open &&
        callerInfo?.id
      ) {
        mediaObj.current = new Media({ audio: true, video: true });

        await mediaObj.current.openStream();

        localVideoRef.current.srcObject = mediaObj.current.getStream();

        peerInstance.current = new Peer();
        setCallInitiating(true);

        peerInstance.current.on("open", (id) => {
          setCallInitiating(false);

          socket.emit("call/accept", {
            callerId: callerInfo.id,
            receiver: { ...currentUser, peerId: id },
          });

          peerInstance.current.on("call", (call) => {
            call.answer(mediaObj.current.getStream());

            call.on("stream", function (stream) {
              remoteVideoRef.current.srcObject = stream;
            });
          });
        });
      }
    })();
  }, [open, localVideoRef.current, mediaObj.current, callerInfo?.id]);

  useEffect(() => {
    socket.on("call/ended", () => {
      toast.info(`Call ended`, {
        position: "top-center",
      });
      onClose();
    });

    return () => {
      socket.off("call/ended");
    };
  }, [onClose, currentUser.id]);

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
  }, [callSetting.mic, callSetting.cam]);

  const handleToggleCam = () => {
    setCallSetting((prev) => ({ ...prev, cam: !prev.cam }));
  };

  const handleToggleMic = () => {
    setCallSetting((prev) => ({ ...prev, mic: !prev.mic }));
  };

  const handleEndCall = () => {
    console.log({ callerInfo });
    socket.emit("call/end", callerInfo.id);
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
            bgcolor: "black",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <video
            ref={localVideoRef}
            style={{
              width: "50%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
            }}
            playsInline
            autoPlay
          >
            Your browser does not support video
          </video>
          <Box
            sx={{
              width: "50%",
              height: "100%",
              position: "relative",
              zIndex: 1000,
            }}
          >
            {callInitiating && (
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  bgcolor: "#cccccc",
                  inset: 0,
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <CircularProgress />
                  <Typography>Call initiating...</Typography>
                </div>
              </Box>
            )}
            <video
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
              Your browser does not support video
            </video>
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
          <Button
            onClick={handleEndCall}
            variant="contained"
            color="error"
            startIcon={<CallEnd />}
          >
            End call
          </Button>

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

export default CallModalReceiver;
