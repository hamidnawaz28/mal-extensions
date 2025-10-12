import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import { styled } from '@mui/material/styles'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { TextSmall } from '../../common/Typography'

const BootstrapedDatePicker = styled(MuiDatePicker)(({ theme }) => ({
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

    '&:focus': {
      boxShadow: '0 2px 2px rgba(0,0,0,0.05)',
    },
  },
}))

export function DatePicker({ label, value, setValue, placeholder }) {
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
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <BootstrapedDatePicker
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
          />
        </LocalizationProvider>
      </FormControl>
    </Box>
  )
}
