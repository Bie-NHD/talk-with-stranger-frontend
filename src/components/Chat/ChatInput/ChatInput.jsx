import { Send } from "@mui/icons-material";
import { Box, Button, Stack, TextField } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";

const ChatInput = ({ onMessageSend, disabled }) => {
  const { register, handleSubmit, setValue } = useForm();

  return (
    <Box
      component="form"
      noValidate
      onSubmit={handleSubmit((data) => onMessageSend(data, setValue))}
    >
      <Stack direction="row" pt={1}>
        <TextField
          fullWidth
          variant="standard"
          label="Type your message here"
          size="small"
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

export default ChatInput;
