import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import InputBase from '@mui/material/InputBase'
import { styled } from '@mui/material/styles'
import { TextSmall } from '../../common/Typography'

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  'label + &': {
    marginTop: theme.spacing(3),
  },
  '& .MuiInputBase-input': {
    borderRadius: 8,
    position: 'relative',
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.secondary,
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    fontSize: 16,
    width: '100%',
    padding: '10px 12px',

    '&::-webkit-calendar-picker-indicator': {
      position: 'absolute',
      right: 10,
      top: '50%',
      transform: 'translateY(-50%) scale(0.6)',
      transformOrigin: 'center',
      cursor: 'pointer',
      opacity: 0.7,
      filter: 'invert(0.5)',
    },

    '&:focus': {
      boxShadow: '0 2px 2px rgba(0,0,0,0.05)',
    },
  },
}))

export function Input({ label, value, setValue, type, placeholder, disabled = false }) {
  return (
    <Box
      component="form"
      noValidate
      sx={{
        display: 'grid',
        gap: 2,
      }}
    >
      <FormControl variant="standard">
        <TextSmall
          sx={(theme) => ({
            color: theme.palette.text.primary,
            fontSize: theme.typography.body1.fontSize,
            fontWeight: 600,
          })}
        >
          {label}
        </TextSmall>
        <BootstrapInput
          disabled={disabled}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          type={type}
          placeholder={String(placeholder)}
        />
      </FormControl>
    </Box>
  )
}
