import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { InputAdornment, IconButton } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Typography from "@mui/material/Typography";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import LoadingButton from "@mui/lab/LoadingButton";
import FormLabel from "@mui/material/FormLabel";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { signUp } from "../../store/userSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import DateOfBirthPicker from "../../components/DateOfBirthPicker/DateOfBirthPicker";
import RadioButtonGroup from "../../components/RadioButtonGroup/RadioButtonGroup";

const SignUpView = () => {
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const { isLoading, currentUser } = useSelector((state) => state.user);
  const [gender, setGender] = useState("male");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const enteredPassword = watch("password");

  useEffect(() => {
    if (currentUser) {
      navigate("/home/profile");
    }
  }, [currentUser, navigate]);

  const handlePasswordConfirmFieldClicked = () =>
    setShowPasswordConfirm((isShow) => !isShow);

  const handleShowPasswordClicked = () => setShowPassword((isShow) => !isShow);

  const handleSignInClicked = (e) => {
    navigate("/auth/signin");
  };

  const handleGenderChanged = (e) => {
    setGender(e.target.value);
  };

  const onSubmit = async (data) => {
    const payload = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      gender: gender,
      major: data.major,
      dob: data.userDob.toDate(),
    };

    dispatch(signUp(payload));
  };

  return (
    <>
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
          Sign up
        </Typography>
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          sx={{ mt: 3 }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoFocus
                fullWidth
                label="First Name"
                {...register("firstName", {
                  required: "Please enter your first name",
                  maxLength: {
                    value: 20,
                    message:
                      "Your first name length must be lower than 20 characters",
                  },
                })}
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                {...register("lastName", {
                  required: "Please enter your last name",
                  maxLength: {
                    value: 20,
                    message:
                      "Your last name length must be lower than 20 characters",
                  },
                })}
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <RadioButtonGroup
                id="edit-profile-genders"
                name="genders"
                formLabel="Genders"
                defaultValue="male"
                value={gender}
                onChange={handleGenderChanged}
                data={[
                  {
                    label: "Male",
                    value: "male",
                  },
                  {
                    label: "Female",
                    value: "female",
                  },
                  {
                    label: "Other",
                    value: "other",
                  },
                ]}
              />
            </Grid>
            <Grid container item spacing={1} xs={12}>
              <Grid item xs={6}>
                <TextField
                  {...register("major", {
                    required: "Please let us known your major",
                  })}
                  fullWidth
                  label="Your Major"
                  error={!!errors?.major}
                  helperText={errors?.major?.message}
                />
              </Grid>
              <Grid item xs={6}>
                <DateOfBirthPicker
                  control={control}
                  customRules={{
                    required: "Please select your birth date",
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: false,
                      error: !!errors.userDob,
                      helperText: errors?.userDob?.message,
                    },
                  }}
                />
              </Grid>
            </Grid>
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
                      <IconButton
                        onClick={handleShowPasswordClicked}
                        edge="end"
                      >
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
                        {showPasswordConfirm ? (
                          <Visibility />
                        ) : (
                          <VisibilityOff />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                {...register("passwordConfirm", {
                  required: "Please enter password confirm",
                  validate: (value) =>
                    value === enteredPassword ||
                    "Password confirm do not match",
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
            <span>Sign Up</span>
          </LoadingButton>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link
                sx={{
                  "&:hover": { cursor: "pointer" },
                }}
                onClick={handleSignInClicked}
                variant="body2"
              >
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default SignUpView;
