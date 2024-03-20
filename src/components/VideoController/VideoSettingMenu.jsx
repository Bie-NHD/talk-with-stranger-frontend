import { Settings } from "@mui/icons-material";
import { Avatar, IconButton, Menu, MenuItem } from "@mui/material";
import { useState } from "react";

const VideoSettingMenu = () => {
  const [anchor, setAnchor] = useState(null);
  const open = !!anchor;

  const handleSettingBtnClicked = (e) => {
    setAnchor(e.currentTarget);
  };

  const handleSettingBtnClose = () => {
    setAnchor(null);
  };

  return (
    <>
      <IconButton
        size="large"
        onClick={handleSettingBtnClicked}
        sx={{
          zIndex: 100,
          position: "absolute",
          right: 0,
          color: "white",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "rotate(90deg) scale(1.1)",
          },
        }}
      >
        <Settings />
      </IconButton>
      <Menu
        anchorEl={anchor}
        open={open}
        onClose={handleSettingBtnClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 0.7,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleSettingBtnClose}>
          <Avatar /> Profile
        </MenuItem>
        <MenuItem onClick={handleSettingBtnClose}>
          <Avatar /> My account
        </MenuItem>
      </Menu>
    </>
  );
};

export default VideoSettingMenu;
