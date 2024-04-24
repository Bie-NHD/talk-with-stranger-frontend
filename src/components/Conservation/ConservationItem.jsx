import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ImageIcon from "@mui/icons-material/Image";
import WorkIcon from "@mui/icons-material/Work";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import { ListItemButton } from "@mui/material";

const ConservationItem = ({ onClick, userData, conservation }) => {
  return (
    <ListItemButton onClick={() => onClick({ conservation, userData })}>
      <ListItemAvatar>
        <Avatar src={userData.avatar} />
      </ListItemAvatar>
      <ListItemText
        primary={userData.fullName}
        secondary={userData.lastestMessage}
      />
    </ListItemButton>
  );
};

export default ConservationItem;
