import { Avatar, Chip, Stack, Typography } from "@mui/material";
import { blue, grey } from "@mui/material/colors";
import moment from "moment";

const ChatMessageItem = ({ messageRight, active, text, sendAt, username }) => {
  const messageStyle = {
    ...(messageRight && { marginLeft: "auto" }),
  };

  const sx = {
    bgcolor: active ? blue[900] : grey[300],
    color: active ? "white" : "black",
  };

  const avatarSx = {
    width: "50px",
    height: "50px",
  };

  const datetimeFormat = "DD-MM-YYYY HH:mm:ss";
  const formatedDatetime = moment(sendAt).format(datetimeFormat);
  return (
    <Stack
      spacing={1}
      direction="row"
      justifyItems="center"
      alignItems="center"
      justifySelf="flex-end"
    >
      {messageRight ? (
        <>
          <div style={messageStyle}>
            <Typography textAlign="right" sx={{ mr: 1, fontSize: "11px" }}>
              {formatedDatetime}
            </Typography>
            <Chip sx={sx} label={text || ""} />
          </div>
          <Avatar sx={avatarSx}>{`${username.charAt(0)}${username.charAt(
            1
          )}`}</Avatar>
        </>
      ) : (
        <>
          <Avatar sx={avatarSx}>{`${username.charAt(0)}${username.charAt(
            1
          )}`}</Avatar>
          <div style={messageStyle}>
            <Typography textAlign="left" sx={{ ml: 1, fontSize: "11px" }}>
              {formatedDatetime}
            </Typography>
            <Chip sx={sx} label={text || ""} />
          </div>
        </>
      )}
    </Stack>
  );
};

export default ChatMessageItem;
