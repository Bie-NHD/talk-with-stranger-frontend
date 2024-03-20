import { DatePicker } from "@mui/x-date-pickers";
import moment from "moment";
import React from "react";
import { Controller } from "react-hook-form";

const DateOfBirthPicker = ({
  name = "userDob",
  customRules,
  control,
  slotProps,
  ...rest
}) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={{
        ...customRules,
        validate: {
          isValidDate: (value) => value?.isBefore(moment()) || "Invalid date",
        },
      }}
      defaultValue={moment(rest.defaultValue)}
      render={({ field }) => {
        return (
          <DatePicker
            {...rest}
            label="Date Of Birth"
            value={field.value}
            inputRef={field.ref}
            onChange={(date) => {
              field.onChange(date);
            }}
            slotProps={{
              ...slotProps,
            }}
          />
        );
      }}
    />
  );
};

export default DateOfBirthPicker;
