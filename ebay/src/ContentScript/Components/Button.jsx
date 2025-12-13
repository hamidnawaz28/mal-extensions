import { Button as MuiButton } from '@mui/material'

export function Button({ label, onClick, ...props }) {
  return (
    <MuiButton
      variant="contained"
      sx={(theme) => ({
        backgroundColor: theme.palette.text.primary,
        color: theme.palette.background.default,
        borderRadius: 5,
        fontSize: theme.typography.body1.fontSize,
        textTransform: 'none',
      })}
      {...props}
      onClick={onClick}
    >
      {label}
    </MuiButton>
  )
}
