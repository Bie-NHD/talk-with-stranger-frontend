import { Visibility, VisibilityOff } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showSuccessToast, showErrorToast } from "../../store/toastSlice";
import AuthService from "../../services/auth.service";

const ResetPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const enteredPassword = watch("password");
  const { state } = useLocation();

  const onSubmit = async (data) => {
    try {
      const authService = new AuthService(
        `${import.meta.env.VITE_BASE_URL}/api/v1`
      );
      setIsLoading(true);
      const res = await authService.resetPassword({
        otp: state.otp,
        email: state.email,
        newPassword: data.password,
      });

      dispatch(showSuccessToast(res.message));
      navigate("/auth/signin");
    } catch (e) {
      dispatch(showErrorToast(e.message));
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordConfirmFieldClicked = () =>
    setShowPasswordConfirm((isShow) => !isShow);

  const handleShowPasswordClicked = () => setShowPassword((isShow) => !isShow);

  return (
    <Box
      maxWidth="500px"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: "rgba(255, 255, 255, 0.09)",
        borderRadius: "16px",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
        backdropFilter: "blur(5px)",
        WebkitBackdropFilter: "blur(5px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        padding: "20px",
      }}
    >
      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        sx={{ mt: 3 }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              {...register("password", {
                required: "Please enter password",
                minLength: {
                  value: 7,
                  message: "Password must be at least 7 characters",
                },
                maxLength: {
                  value: 30,
                  message: "Password must be at most 30 characters",
                },
              })}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleShowPasswordClicked} edge="end">
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Password Confirm"
              type={showPasswordConfirm ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handlePasswordConfirmFieldClicked}
                      edge="end"
                    >
                      {showPasswordConfirm ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              {...register("passwordConfirm", {
                required: "Please enter password confirm",
                validate: (value) =>
                  value === enteredPassword || "Password confirm do not match",
              })}
              error={!!errors.passwordConfirm}
              helperText={errors.passwordConfirm?.message}
            />
          </Grid>
        </Grid>
        <LoadingButton
          type="submit"
          loading={isLoading}
          loadingIndicator="Processing…"
          variant="contained"
          fullWidth
          sx={{ mt: 3, mb: 2 }}
        >
          <span>Submit</span>
        </LoadingButton>
      </Box>
    </Box>
  );
};

export default ResetPassword;
