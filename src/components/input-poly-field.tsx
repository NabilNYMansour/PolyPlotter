import { TextField } from "@mui/material";
import { ChangeEvent, useState } from "react";
import { Polynomial } from "../interfaces";

export const InputPolyField = ({
  polynomial,
  updatePolyString,
  updatePolyColor,
}: {
  polynomial: Polynomial;
  updatePolyString: (id: number, newString: string) => void;
  updatePolyColor: (id: number, newColor: string) => void;
}) => {
  const [selectedColor, setSelectedColor] = useState<string>("#ff00ff");

  const handleInputString = (event: ChangeEvent<HTMLInputElement>) =>
    updatePolyString(polynomial.id, event.target.value);

  const handleInputColor = (event: ChangeEvent<HTMLInputElement>) => {
    // updatePolyColor(polynomial.id, event.target.value);
    setSelectedColor(event.target.value);
  };
  return (
    <span>
      <TextField
        id="outlined-basic"
        variant="outlined"
        placeholder="Place Poly Here"
        value={polynomial.polyString}
        onChange={handleInputString}
      ></TextField>
      <input
        className="input-field-color"
        type="color"
        value={polynomial.color}
        onChange={handleInputColor}
        onBlur={() => {
          updatePolyColor(polynomial.id, selectedColor);
        }}
      ></input>
    </span>
  );
};
