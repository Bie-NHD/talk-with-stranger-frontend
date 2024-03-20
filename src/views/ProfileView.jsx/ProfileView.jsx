import {
  Backdrop,
  Box,
  CircularProgress,
  Container,
  Grid,
} from "@mui/material";
import UserProfileCard from "../../components/UserProfileCard/UserProfileCard";
import EditProfileForm from "../../components/EditProfileForm/EditProfileForm";
import { useState } from "react";
import PreviewAvatarModal from "../../components/PreviewAvatarModal/PreviewAvatarModal";
import { useDispatch, useSelector } from "react-redux";
import { updateAvatar, updateBackground } from "../../store/userSlice";
import PreviewPictureModal from "../../components/PreviewPictureModal/PreviewPictureModal";
import { updateUser } from "../../store/userSlice";

const ProfileView = () => {
  const [avatarSrc, setAvatarSrc] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [backgroundModalOpen, setBackgroundModalOpen] = useState(false);
  const [backgroundSrc, setBackgroundSrc] = useState(null);
  const { currentUser, isLoading } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  console.log(currentUser);
  const handleAvatarUploadChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarSrc(e.target.files[0]);
    }
    setModalOpen(true);
  };

  const handleBackgroundChange = (e) => {
    console.log("background change");
    if (e.target.files && e.target.files[0]) {
      setBackgroundSrc(e.target.files[0]);
      setBackgroundModalOpen(true);
    }
  };

  const onEditFormSubmit = (data) => {
    dispatch(updateUser(data));
  };

  const handleBackgroundSave = () => {
    if (backgroundSrc) {
      dispatch(updateBackground(backgroundSrc));
      setBackgroundSrc(null);
    }
    setBackgroundModalOpen(false);
  };

  const handleAvatarSave = () => {
    if (avatarSrc) {
      dispatch(updateAvatar(avatarSrc));
      setAvatarSrc(null);
    }
    setModalOpen(false);
  };

  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <PreviewAvatarModal
        onClose={() => {
          setAvatarSrc(null);
          setModalOpen(false);
        }}
        open={modalOpen}
        onSave={handleAvatarSave}
        src={avatarSrc ? URL.createObjectURL(avatarSrc) : ""}
      />
      <PreviewPictureModal
        onClose={() => {
          setBackgroundSrc(null);
          setBackgroundModalOpen(false);
        }}
        open={backgroundModalOpen}
        onSave={handleBackgroundSave}
        src={backgroundSrc ? URL.createObjectURL(backgroundSrc) : ""}
      />
      <Container maxWidth="lg">
        <Box component="div">
          <Grid container>
            <Grid sx={{ pr: 2 }} item xs={5}>
              <UserProfileCard
                user={currentUser}
                onAvatarSelect={handleAvatarUploadChange}
                onBackgroundSelect={handleBackgroundChange}
              />
            </Grid>
            <Grid sx={{ pl: 2 }} item xs={7}>
              <EditProfileForm
                onSubmit={onEditFormSubmit}
                initialValue={currentUser}
              />
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
};

export default ProfileView;
