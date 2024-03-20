import {
  Camera,
  CameraAlt,
  Mic,
  MicOff,
  NoPhotography,
  VolumeDown,
  VolumeUp,
} from "@mui/icons-material";
import { Button, IconButton, Slider, Stack } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

const SettingBarFullControl = ({
  onVolumeChange,
  volume,
  onMicBtnClicked,
  micMute,
  onCameraBtnClicked,
  cameraOff,
  onSkipBtnClicked,
  loading,
}) => {
  return (
    <Stack
      direction="row"
      p={1}
      bgcolor="rgba(105,105,105,0.7)"
      sx={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        color: "white",
      }}
      justifyContent="space-between"
    >
      <Stack
        mr={3}
        width="200px"
        spacing={2}
        direction="row"
        alignItems="center"
      >
        <VolumeDown />
        <Slider aria-label="Volume" value={volume} onChange={onVolumeChange} />
        <VolumeUp />
      </Stack>
      <IconButton onClick={onMicBtnClicked} sx={{ color: "white", mr: 3 }}>
        {!micMute ? <Mic /> : <MicOff />}
      </IconButton>
      <IconButton onClick={onCameraBtnClicked} sx={{ color: "white" }}>
        {!cameraOff ? <CameraAlt /> : <NoPhotography />}
      </IconButton>
      <LoadingButton
        loading={loading}
        onClick={onSkipBtnClicked}
        sx={{ marginLeft: "auto" }}
        color="primary"
        variant="contained"
      >
        Find Next
      </LoadingButton>
    </Stack>
  );
};

const SettingBarVolumeControl = ({ onVolumeChange, volume }) => {
  return (
    <Stack
      direction="row"
      p={1}
      bgcolor="rgba(105,105,105,0.7)"
      sx={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        color: "white",
      }}
      justifyContent="space-between"
    >
      <Stack
        mr={3}
        width="200px"
        spacing={2}
        direction="row"
        alignItems="center"
      >
        <VolumeDown />
        <Slider aria-label="Volume" value={volume} onChange={onVolumeChange} />
        <VolumeUp />
      </Stack>
    </Stack>
  );
};

export { SettingBarFullControl, SettingBarVolumeControl };
