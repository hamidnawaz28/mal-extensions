import { styled } from "@mui/system";

export const H1 = styled("h1")(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: theme.typography.h1.fontSize,
  fontWeight: 600,
  margin: "0 0 16px",
  color: theme.palette.text.primary,
}));

export const H2 = styled("h2")(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: theme.typography.h2.fontSize,
  fontWeight: 500,
  margin: "0 0 12px",
  color: theme.palette.text.primary,
}));

export const TextLarge = styled("p")(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: theme.typography.body1.fontSize,
  margin: "0 0 4px",
  color: theme.palette.text.primary,
}));

export const TextSmall = styled("p")(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: theme.typography.body2.fontSize,
  margin: "0 0 4px",
  color: theme.palette.text.secondary,
  fontWeight: 600,
}));
