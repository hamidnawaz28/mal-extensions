import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

export function Switch({ check, setCheck }) {
  return (
    <FormGroup>
      <FormControlLabel
        sx={{
          margin: 0,
        }}
        control={check ? <LightModeIcon /> : <DarkModeIcon />}
        onClick={() => setCheck(!check)}
      />
    </FormGroup>
  );
}
