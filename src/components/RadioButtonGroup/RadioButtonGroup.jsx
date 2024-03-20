import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import React from "react";

const RadioButtonGroup = ({
  id,
  name,
  formLabel,
  defaultValue,
  value,
  onChange,
  data,
}) => {
  return (
    <FormControl>
      <FormLabel id={id}>{formLabel}</FormLabel>
      <RadioGroup
        row
        aria-labelledby={id}
        name={name}
        defaultValue={defaultValue}
        value={value}
        onChange={onChange}
      >
        {data?.map((obj, i) => {
          let isFocus = value === defaultValue;
          return (
            <FormControlLabel
              key={i}
              autoFocus={isFocus}
              value={obj.value}
              control={<Radio />}
              label={obj.label}
            />
          );
        })}
      </RadioGroup>
    </FormControl>
  );
};

export default RadioButtonGroup;
