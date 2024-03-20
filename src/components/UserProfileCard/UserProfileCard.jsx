import { useMemo, useRef, useState } from "react";
import { Edit, Flag, Upload } from "@mui/icons-material";
import { Avatar, Box, Button, Stack, Typography } from "@mui/material";
import moment from "moment";

const UserProfileCard = ({ user, onAvatarSelect, onBackgroundSelect }) => {
  const {
    user_first_name,
    user_last_name,
    user_description,
    user_dob,
    user_avatar,
    user_background,
    user_major,
    user_country,
  } = user;
  const [hover, setHover] = useState(false);
  const avatarRef = useRef();
  const backgroundRef = useRef();

  const calculateAge = useMemo(() => {
    if (!user_dob) return "unknown";

    return moment().diff(moment(user_dob), "years");
  }, [user_dob]);

  const handleMouseEnterAvatar = () => {
    setHover(true);
  };

  const handleMouseLeaveAvatar = () => {
    setHover(false);
  };
  return (
    <Box
      component="div"
      sx={{
        borderRadius: "10px",
        p: 2,
        backgroundColor: "white",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
        backdropFilter: "blur(5px)",
        WebkitBackdropFilter: "blur(5px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
      }}
    >
      <Box
        component="div"
        sx={{
          borderRadius: "calc(10px - 1px)",
          position: "relative",
          height: "130px",
          width: "100%",
          background: ` url(${user_background}), linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <input
          accept="image/*"
          id="background-upload"
          type="file"
          onChange={onBackgroundSelect}
          ref={backgroundRef}
          onClick={() => {
            backgroundRef.current.value = null;
          }}
          hidden
        />
        <Button
          size="small"
          component="label"
          htmlFor="background-upload"
          sx={{
            position: "absolute",
            right: "10px",
            bottom: "10px",
            opacity: "0.7",
            textTransform: "none",
          }}
          color="secondary"
          endIcon={<Edit />}
          variant="contained"
        >
          Edit background
        </Button>
      </Box>
      <Box
        sx={{
          width: "90px",
          height: "90px",
          marginTop: "-45px",
          ml: 1,
          position: "relative",
        }}
        onMouseEnter={handleMouseEnterAvatar}
        onMouseLeave={handleMouseLeaveAvatar}
      >
        <input
          accept="image/*"
          id="avatar-upload"
          ref={avatarRef}
          type="file"
          onChange={onAvatarSelect}
          onClick={() => {
            avatarRef.current.value = null;
          }}
          hidden
        />
        {hover ? (
          <label
            style={{
              height: "100%",
              width: "100%",
              zIndex: "10",
              position: "absolute",
              top: "0",
              left: "0",
            }}
            htmlFor="avatar-upload"
          >
            <Button
              variant="raise"
              component="span"
              sx={{
                cursor: "pointer",
                bgcolor: "rgba(0,0,0,0.1)",
                height: "100%",
                width: "100%",
              }}
            >
              <Upload
                style={{
                  color: "#ede7f6",
                }}
              />
            </Button>
          </label>
        ) : (
          <></>
        )}
        <Avatar
          sx={{
            width: "100%",
            height: "100%",
            border: "5px solid rgba(255, 255, 255)",
            position: "absolute",
            top: "0",
            left: "0",
            zIndex: 1,
          }}
          src={user_avatar}
        >
          {`${user_first_name.charAt(0)} ${user_last_name.charAt(0)}`}
        </Avatar>
      </Box>
      <Stack sx={{ pl: 1 }} spacing={2}>
        <Box sx={{ maxHeight: "50px", display: "flex", alignItems: "center" }}>
          <Typography
            sx={{ display: "flex", alignItems: "center" }}
            variant="h5"
          >
            {`${user_first_name} ${user_last_name}`} |
          </Typography>
          <Box
            sx={{ width: "40px", ml: 1, display: "grid", placeItems: "center" }}
            component="span"
          >
            {user_country?.country_iso_code ? (
              <img
                loading="lazy"
                style={{ height: "100%", width: "100%" }}
                srcSet={`https://flagcdn.com/w40/${user_country?.country_iso_code.toLowerCase()}.png 2x`}
                src={`https://flagcdn.com/w20/${user_country?.country_iso_code.toLowerCase()}.png`}
              />
            ) : (
              <Flag sx={{ marginLeft: "-30px" }} />
            )}
          </Box>
        </Box>
        <Typography variant="subtitle1">
          {" "}
          {calculateAge} | {user_major || "unknown"}
        </Typography>
        <Typography variant="body2">{user_description ?? ""}</Typography>
      </Stack>
    </Box>
  );
};

export default UserProfileCard;
