import { Autocomplete, Box, MenuItem, TextField } from "@mui/material";

const CountriesSelect = ({ countries, value, onSelectionChange, loading }) => {
  return (
    <Autocomplete
      id="country-select-demo"
      loading={loading}
      value={value}
      onChange={onSelectionChange}
      options={countries}
      autoHighlight
      getOptionLabel={(option) => option.country_name}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      renderOption={(props, option) => (
        <Box
          component="li"
          sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
          {...props}
        >
          <img
            loading="lazy"
            width="20"
            srcSet={`https://flagcdn.com/w40/${option.country_iso_code.toLowerCase()}.png 2x`}
            src={`https://flagcdn.com/w20/${option.country_iso_code.toLowerCase()}.png`}
            alt=""
          />
          {option.label} ({option.country_iso_code}) +{option.country_code}
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          fullWidth
          label="Choose a country"
          inputProps={{
            ...params.inputProps,
            autoComplete: "new-password", // disable autocomplete and autofill
          }}
        />
      )}
    />
  );
};

export default CountriesSelect;
