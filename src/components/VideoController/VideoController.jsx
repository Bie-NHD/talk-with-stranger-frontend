import { Settings } from "@mui/icons-material";
import {
  Avatar,
  Box,
  CircularProgress,
  IconButton,
  LinearProgress,
  Menu,
  MenuItem,
  Slide,
  Stack,
  Typography,
} from "@mui/material";
import { useState, forwardRef } from "react";
import { SettingBarFullControl } from "./SettingBar";

const VideoController = (
  {
    fullControl,
    onSkipBtnClick,
    options = { audio: true, video: true },
    onCameraBtnClick,
    onMicBtnClick,
    onVolumeChange,
    volume,
    loading,
    screenLoading,
    userInfo,
  },
  ref
) => {
  const [hover, setHover] = useState(false);
  return (
    <Box
      component="div"
      sx={{
        overflow: "hidden",
        position: "relative",
        height: "100%",
        width: "100%",
        borderRadius: "10px",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {userInfo && !loading && (
        <Stack
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            padding: "10",
            width: "100%",
            height: "50px",
            zIndex: 100,
            bgcolor: "rgba(105,105,105,0.7)",
            alignItems: "center",
            paddingX: "10px",
          }}
          direction="row"
          spacing={2}
        >
          <Avatar src={userInfo?.userAvatarUrl} />
          <Typography sx={{ color: "white" }}>{userInfo?.userName}</Typography>
          {userInfo?.userCountry?.country_iso_code && (
            <img
              width="40px"
              srcSet={`https://flagcdn.com/w40/${userInfo?.userCountry?.country_iso_code.toLowerCase()}.png 2x`}
              src={`https://flagcdn.com/w40/${userInfo?.userCountry?.country_iso_code.toLowerCase()}.png`}
            />
          )}
        </Stack>
      )}

      {screenLoading && (
        <Box
          sx={{
            height: "100%",
            width: "100%",
            display: "grid",
            placeItems: "center",
            bgcolor: "rgba(0,0,0,0.4)",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: "9999",
          }}
        >
          <CircularProgress color="primary" />
        </Box>
      )}
      <video
        ref={ref}
        playsInline
        autoPlay
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "black",
          position: "absolute",
          top: 0,
          left: 0,
          objectFit: "cover",
          objectPosition: "center",
          overflow: "hidden",
          borderRadius: "10px",
        }}
      >
        Your browser doesn't support video
      </video>
      {hover && fullControl && (
        <SettingBarFullControl
          onVolumeChange={onVolumeChange}
          volume={volume}
          onMicBtnClicked={onMicBtnClick}
          micMute={!options.audio}
          onCameraBtnClicked={onCameraBtnClick}
          cameraOff={!options.video}
          onSkipBtnClicked={onSkipBtnClick}
          loading={loading}
        />
      )}
    </Box>
  );
};

export default forwardRef(VideoController);
