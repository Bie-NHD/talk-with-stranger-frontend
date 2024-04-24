import { Search } from "@mui/icons-material";
import { Box, Button, TextField } from "@mui/material";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import SearchSuggestionBox from "./SearchSuggestionBox";
import ConservationService from "../../services/conservation.service";
import { useSelector } from "react-redux";
import { debounce } from "../../utils";
import { useCallback } from "react";

const SeachSuggestion = ({ onSuggestionItemClick }) => {
  const { register, handleSubmit, setValue } = useForm();
  const [searchResults, setSearchResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const userSlice = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);

  const search = useCallback(
    debounce(async (text) => {
      if (text === "") {
        setSearchResults([]);
        setShowSuggestions(false);
        return;
      }

      setLoading(true);
      try {
        const conservationService = new ConservationService(
          `${import.meta.env.VITE_BASE_URL}/api/v1`
        );

        const searchResults = await conservationService.searchConservation({
          uid: userSlice.currentUser.id,
          tokens: userSlice.userToken,
          limit: 10,
          page: 1,
          keySearch: text,
        });

        const suggestion = searchResults.metadata.data.map((sr) => {
          console.log(sr);
          return {
            id: sr.conservation_id,
            name: `${sr.user_first_name} ${sr.user_last_name}`,
            avatarSrc: sr.user_avatar,
          };
        });

        setSearchResults(suggestion);
        console.log(suggestion);
        setShowSuggestions(true);
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    }, 500),
    []
  );

  const handleSearchChange = async (e) => {
    const value = e.target.value;

    search(value);
  };

  const handleSuggestionItemClick = (id) => {
    onSuggestionItemClick(id);
    setShowSuggestions(false);
    setSearchResults([]);
    setValue("search", "");
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit()}
      sx={{
        width: "100%",
        p: 2,
        display: "flex",
        position: "relative",
        zIndex: 1000,
      }}
    >
      <TextField
        {...register("search", {
          required: true,
          onChange: handleSearchChange,
        })}
        label="Search consevation"
        fullWidth
        size="small"
      />
      <Button sx={{ ml: 1 }} variant="contained" type="submit">
        <Search />
      </Button>

      {searchResults?.length > 0 && showSuggestions && (
        <SearchSuggestionBox
          sx={{
            borderRadius: "5px",
            position: "absolute",
            top: "calc(100% - 10px)",
            bottom: 0,
            zIndex: 1000,
            width: "261px",
            bgcolor: "white",
            boxShadow: 2,
          }}
          onItemClick={handleSuggestionItemClick}
          loading={loading}
          conservations={searchResults}
        />
      )}
    </Box>
  );
};

export default SeachSuggestion;
