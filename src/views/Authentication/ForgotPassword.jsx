import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { MuiOtpInput } from "mui-one-time-password-input";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import AuthService from "../../services/auth.service";
import { useDispatch } from "react-redux";
import { showSuccessToast, showErrorToast } from "../../store/toastSlice";

const ForgotPassword = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleVerifyEmail = async (data) => {
    try {
      const authService = new AuthService(
        `${import.meta.env.VITE_BASE_URL}/api/v1`
      );
      setIsLoading(true);

      const res = await authService.forgotPassword(data.email);
      dispatch(showSuccessToast(res.message));
      navigate("/auth/reset-password", {
        state: {
          email: data.email,
        },
      });
    } catch (err) {
      dispatch(showErrorToast(err.message));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* <Modal open={optModal} onClose={() => setOtpModal(false)}>
        <Box
          width="30rem"
          bgcolor="white"
          sx={{
            boxShadow: 2,
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            padding: "15px",
            borderRadius: "5px",
          }}
        >
          <Typography
            sx={{
              mb: 2,
            }}
            variant="h4"
          >
            Enter otp
          </Typography>
          <MuiOtpInput
            value={otp}
            onChange={handleOtpChange}
            length={6}
            onComplete={handleOtpInputComplete}
          />
        </Box>
      </Modal> */}
      <Stack
        sx={{
          width: "30rem",
          boxShadow: 2,
          padding: "10px",
          borderRadius: "5px",
        }}
        direction="column"
        spacing={2}
        onSubmit={handleSubmit(handleVerifyEmail)}
        component="form"
      >
        <Typography variant="h5">Enter your email</Typography>
        <TextField
          {...register("email", {
            required: "Please enter your email address",
            pattern: {
              value: new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/),
              message: "Please enter a valid email address",
            },
          })}
          error={!!errors.email}
          helperText={errors.email?.message}
          fullWidth
        />
        <LoadingButton loading={isLoading} type="submit" variant="contained">
          Send otp
        </LoadingButton>
      </Stack>
    </>
  );
};

export default ForgotPassword;
