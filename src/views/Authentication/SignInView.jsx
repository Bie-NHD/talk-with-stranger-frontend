import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import {
  InputAdornment,
  IconButton,
  FormGroup,
  FormControlLabel,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import LoadingButton from "@mui/lab/LoadingButton";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signIn } from "../../store/userSlice";

const SignInView = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { isLoading, currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate("/home/profile");
    }
  }, [currentUser]);

  const handleShowPasswordClicked = () => setShowPassword((isShow) => !isShow);
  const handleRememerMeBtnClicked = (e) => {
    setRememberMe(e.target.checked);
  };
  const handleSignUpBtnClicked = (e) => {
    e.preventDefault();
    navigate("/auth/signup");
  };
  const handleForgotPasswordClicked = (e) => {
    e.preventDefault();
  };

  const onSubmit = async (data) => {
    const submitedData = {
      userData: {
        email: data.email,
        password: data.password,
      },
      isRememberMe: rememberMe,
    };

    dispatch(signIn(submitedData));
  };

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
      <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Sign in
      </Typography>
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
              label="Email Address"
              {...register("email", {
                required: "Please enter an email address",
                pattern: {
                  value: new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/),
                  message: "Please enter a valid email address",
                },
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
          </Grid>
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
          <Grid item xs={12} sx={{ mb: 4 }}>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox onChange={handleRememerMeBtnClicked} />}
                label="Remember me ?"
              />
            </FormGroup>
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
          <span>Sign In</span>
        </LoadingButton>
        <Grid container justifyContent="space-between">
          <Grid onClick={handleForgotPasswordClicked} item>
            <Link variant="body2">Forgot your password ?</Link>
          </Grid>
          <Grid onClick={handleSignUpBtnClicked} item>
            <Link href="#" variant="body2">
              Create an account? Sign up
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default SignInView;
