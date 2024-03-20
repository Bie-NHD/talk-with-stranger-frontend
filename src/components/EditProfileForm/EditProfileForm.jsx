import React, { useEffect, useMemo, useState } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import { Box, FormControl, Grid, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import CountryService from "../../services/country.service";
import CountriesSelect from "../CountriesSelect/CountriesSelect";
import DateOfBirthPicker from "../DateOfBirthPicker/DateOfBirthPicker";
import RadioButtonGroup from "../RadioButtonGroup/RadioButtonGroup";

const EditProfileForm = ({ onSubmit, initialValue }) => {
  const {
    user_first_name,
    user_last_name,
    user_description,
    user_dob,
    user_major,
    user_gender,
    user_country,
  } = initialValue;

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      editFirstName: user_first_name,
      editLastName: user_last_name,
      userDesc: user_description,
      major: user_major,
    },
  });

  const [countries, setCountries] = useState([]);
  const [gender, setGender] = useState(user_gender || "male");
  const [loading, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(user_country);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const countryService = new CountryService(
        `${import.meta.env.VITE_BASE_URL}/api/v1`
      );
      const response = await countryService.getAllCountries();
      setCountries(response.metadata);
      setLoading(false);
    })();
  }, []);

  const handleFormSubmit = (data) => {
    const user = {
      user_first_name: data?.editFirstName,
      user_last_name: data?.editLastName,
      user_major: data?.major,
      user_dob: data?.userDob.toDate(),
      user_country: selectedCountry?.id,
      user_gender: gender,
      user_description: data.userDesc,
    };
    onSubmit(user);
  };

  const handleGendersChanged = (e) => {
    setGender(e.target.value);
  };

  const handleSelectionChange = (value, newValue) => {
    setSelectedCountry(newValue);
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
        onSubmit={handleSubmit(handleFormSubmit)}
        component="form"
        noValidate
        sx={{ mt: 3 }}
      >
        <Grid container spacing={2}>
          <Grid mb={3} item xs={12} justifyContent="center">
            <Typography textAlign="center" variant="h4">
              Edit Profile
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="First Name"
              fullWidth
              {...register("editFirstName", {
                required: "This field can't be empty",
              })}
              error={!!errors.editFirstName}
              helperText={errors.editFirstName?.message}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Last Name"
              fullWidth
              {...register("editLastName", {
                required: "This field can't be empty",
              })}
              error={!!errors.editLastName}
              helperText={errors.editLastName?.message}
            />
          </Grid>
          <Grid item xs={12}>
            <RadioButtonGroup
              id="edit-profile-genders"
              name="genders"
              formLabel="Genders"
              defaultValue={user_gender}
              value={gender}
              onChange={handleGendersChanged}
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
          <Grid item container spacing={2} xs={12}>
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
                defaultValue={user_dob}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.userDob,
                    helperText: errors?.userDob?.message,
                  },
                }}
              />
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <CountriesSelect
                loading={loading}
                countries={countries}
                value={selectedCountry}
                onSelectionChange={handleSelectionChange}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              multiline
              rows={4}
              variant="filled"
              fullWidth
              {...register("userDesc")}
            />
          </Grid>
        </Grid>
        <LoadingButton
          type="submit"
          loadingIndicator="Processing…"
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          <span>Save</span>
        </LoadingButton>
      </Box>
    </Box>
  );
};

export default EditProfileForm;
