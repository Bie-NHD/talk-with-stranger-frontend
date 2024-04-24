import {
  Avatar,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Paper,
} from "@mui/material";
import React from "react";

const SearchSuggestionBox = ({ conservations, sx, loading, onItemClick }) => {
  return (
    <Paper sx={{ ...sx }}>
      <List sx={{ bgcolor: "white", boxShadow: 1 }}>
        {loading && <ListItemText>Loading...</ListItemText>}
        {!loading &&
          conservations.length > 0 &&
          conservations.map((c) => (
            <ListItemButton onClick={() => onItemClick(c.id)}>
              <ListItemAvatar>
                <Avatar src={c.avatarSrc} />
              </ListItemAvatar>
              <ListItemText>{c.name}</ListItemText>
            </ListItemButton>
          ))}
      </List>
    </Paper>
  );
};

export default SearchSuggestionBox;
