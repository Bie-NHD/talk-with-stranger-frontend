import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import FriendRequestList from "../../components/FriendRequest/FriendRequestList";
import FriendRequestService from "../../services/friendRequest.service";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const FriendRequest = () => {
  const [friendRequests, setFriendRequests] = useState([]);
  const userSlice = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);

      const fser = new FriendRequestService(
        `${import.meta.env.VITE_BASE_URL}/api/v1`
      );

      const response = await fser.getAllFriendRequest({
        uid: userSlice.currentUser.id,
        tokens: userSlice.userToken,
      });

      setLoading(false);
      setFriendRequests(response.metadata.data);
    })();
  }, []);

  const handleFriendRequestAccept = async (friendRequestId) => {
    try {
      const fser = new FriendRequestService(
        `${import.meta.env.VITE_BASE_URL}/api/v1`
      );

      await fser.acceptFriendRequest({
        friendRequestId: friendRequestId,
        uid: userSlice.currentUser.id,
        tokens: userSlice.userToken,
      });

      setFriendRequests((prev) => prev.filter((f) => f.id !== friendRequestId));
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleFriendRequestReject = async (friendRequestId) => {
    try {
      const fser = new FriendRequestService(
        `${import.meta.env.VITE_BASE_URL}/api/v1`
      );

      await fser.rejectFriendRequest({
        friendRequestId: friendRequestId,
        uid: userSlice.currentUser.id,
        tokens: userSlice.userToken,
      });

      setFriendRequests((prev) => prev.filter((f) => f.id !== friendRequestId));
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      component="div"
    >
      <FriendRequestList
        onFriendRequestAccept={handleFriendRequestAccept}
        onFriendRequestReject={handleFriendRequestReject}
        loading={loading}
        data={friendRequests}
      />
    </Box>
  );
};

export default FriendRequest;
