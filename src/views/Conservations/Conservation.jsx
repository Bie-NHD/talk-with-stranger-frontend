import {
  Box,
  CircularProgress,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import ConservationList from "../../components/Conservation/ConservationList";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import ConservationService from "../../services/conservation.service";
import { useSelector } from "react-redux";
import useInfinityScroll from "../../hooks/useInfinityScroll";
import ConservationChatRoom from "../../components/Chat/ConservationChatRoom/ConservationChatRoom";
import SeachSuggestion from "../../components/SearchAutoComplete/SeachSuggestion";

const Conservation = () => {
  const userSlice = useSelector((state) => state.user);
  const [currentConservation, setCurrentConservation] = useState();
  const bottomRef = useRef();
  const firstMount = useRef(true);
  const {
    loading: isLoading,
    error,
    data: conservations,
    setData: setConservations,
  } = useInfinityScroll({
    beginPage: 1,
    bottomEl: bottomRef,
    cb: async (currentPage) => {
      const conservationService = new ConservationService(
        `${import.meta.env.VITE_BASE_URL}/api/v1`
      );

      const conservations = await conservationService.getAllConservations({
        uid: userSlice.currentUser.id,
        tokens: userSlice.userToken,
        page: currentPage,
        limit: 10,
      });

      return conservations.metadata.data;
    },
  });

  useEffect(() => {
    if (firstMount.current && conservations?.length > 0) {
      const c = conservations[0];

      const foundMember = c.members.find(
        (m) => m.id !== userSlice.currentUser.id
      );

      const remoteData = {
        id: foundMember.id,
        avatar: foundMember.user_avatar,
        fullName: `${foundMember.user_first_name} ${foundMember.user_last_name}`,
        gender: foundMember.user_gender,
        dob: foundMember.user_dob,
        lastestMessage: foundMember.lastestMessage,
      };

      setCurrentConservation({ userData: remoteData, conservation: c });
      // firstMount.current = false;
    }
  }, [conservations]);

  const handleConservationItemClick = (data) => {
    setCurrentConservation(data);
  };

  const handleSuggestionClick = async (id) => {
    console.log(id);
    const conservationService = new ConservationService(
      `${import.meta.env.VITE_BASE_URL}/api/v1`
    );

    const foundConservation = await conservationService.getConservation({
      uid: userSlice.currentUser.id,
      tokens: userSlice.userToken,
      conservationId: id,
    });

    const c = foundConservation.metadata;

    const foundMember = c.members.find(
      (m) => m.id !== userSlice.currentUser.id
    );

    const remoteData = {
      avatar: foundMember.user_avatar,
      fullName: `${foundMember.user_first_name} ${foundMember.user_last_name}`,
      gender: foundMember.user_gender,
      dob: foundMember.user_dob,
      lastestMessage: foundMember.lastestMessage,
    };

    setCurrentConservation({ userData: remoteData, conservation: c });
    setConservations((prev) => {
      if (!prev.find((ci) => ci.id === c.id)) {
        return [foundConservation, ...prev];
      } else {
        return [...prev];
      }
    });
  };

  return (
    <Grid
      container
      sx={{
        height: "88vh",
      }}
    >
      <Grid
        item
        xs={3}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          textAlign: "center",
        }}
      >
        {error && <Typography variant="secondary">{error.message}</Typography>}
        {!isLoading && conservations?.length <= 0 && (
          <Typography variant="secondary">
            You haven't had any conservations yet!
          </Typography>
        )}
        {!isLoading && conservations?.length > 0 && (
          <>
            <SeachSuggestion onSuggestionItemClick={handleSuggestionClick} />
            <ConservationList
              sx={{
                width: "100%",
                height: "100%",
                overflowY: "auto",
                "&::-webkit-scrollbar": {
                  width: "0.3em",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: (theme) => theme.palette.divider,
                  borderRadius: "100vmax",
                },
              }}
              onItemClick={handleConservationItemClick}
              conservations={conservations}
            />
          </>
        )}
        {isLoading && <CircularProgress />}
        <div ref={bottomRef}></div>
      </Grid>
      <Grid item xs={9}>
        {currentConservation && (
          <ConservationChatRoom conservation={currentConservation} />
        )}
      </Grid>
    </Grid>
  );
};

export default Conservation;
