import { AttachFile, Image, Send } from "@mui/icons-material";
import { Box, Button, IconButton, Stack, TextField } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";

const ConservationChatBar = ({ onMessageSend, disabled, sx }) => {
  const { register, handleSubmit, setValue } = useForm();
  return (
    <Box
      sx={sx}
      component="form"
      noValidate
      onSubmit={handleSubmit((data) => onMessageSend(data, setValue))}
    >
      <Stack direction="row" pt={2} sx={{ alignItems: "center" }}>
        <IconButton>
          <Image />
        </IconButton>
        <IconButton>
          <AttachFile />
        </IconButton>
        <input
          style={{
            fontSize: "17px",
            padding: "7px 15px",
            borderRadius: "100vmax",
            outline: "none",
            border: "none",
            width: "100%",
            backgroundColor: "#f3f3f5",
          }}
          placeholder="Aa"
          {...register("chatMessageInput", {
            required: true,
          })}
        />
        <Button
          disabled={disabled}
          type="submit"
          sx={{ ml: 2, minWidth: "70px" }}
          variant="contained"
        >
          <Send />
        </Button>
      </Stack>
    </Box>
  );
};

export default ConservationChatBar;
