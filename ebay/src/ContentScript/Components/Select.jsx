import FormControl from '@mui/material/FormControl'
import InputBase from '@mui/material/InputBase'
import NativeSelect from '@mui/material/NativeSelect'
import { styled } from '@mui/material/styles'
import { TextSmall } from '../../common/Typography'

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  'label + &': {
    marginTop: theme.spacing(3),
  },
  '& .MuiInputBase-input': {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.background.default,
    border: 'none',
    fontSize: 16,
    padding: '10px 26px 10px 12px',

    '&:focus': {
      borderRadius: 4,
      border: 'none',
      boxShadow: 'none',
    },
  },
}))

export function Select({ label, options, value, setValue }) {
  const handleChange = (event) => {
    setValue(event.target.value)
  }
  return (
    <FormControl variant="standard" sx={{ width: '100%' }}>
      <TextSmall
        sx={(theme) => ({
          color: theme.palette.text.primary,
          fontSize: theme.typography.body1.fontSize,
          fontWeight: 600,
          marginBottom: 1,
        })}
      >
        {label}
      </TextSmall>
      <NativeSelect
        value={value}
        onChange={handleChange}
        input={<BootstrapInput />}
        sx={(theme) => ({
          color: theme.palette.text.secondary,
          width: '100%',
          '& select': {
            width: '100%',
          },
        })}
      >
        {options.map((option, key) => (
          <option value={option.value} key={key}>
            {option.label}
          </option>
        ))}
      </NativeSelect>
    </FormControl>
  )
}
