import { Box } from "@mui/material";
import { TextSmall } from "../../common/Typography";

export function KeyValue({ label, value }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        gap: 2,
      }}
    >
      <TextSmall
        sx={{
          flex: 1,
          textAlign: "left",
          width: "100%",
        }}
      >
        {label}
      </TextSmall>
      <TextSmall
        sx={(theme) => ({
          flex: 1,
          textAlign: "right",
          color: theme.palette.text.primary,
          fontWeight: 600,
          width: "100%",
        })}
      >
        {value}
      </TextSmall>
    </Box>
  );
}
