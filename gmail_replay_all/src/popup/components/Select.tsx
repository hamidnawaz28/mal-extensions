import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'

export default function SelectComponent({ label, value, setValue, options }: any) {
    const handleChange = (event: any) => {
        setValue(event.target.value as string)
    }

    return (
        <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
                <InputLabel>{label}</InputLabel>
                <Select value={value} onChange={handleChange}>
                    {options.map((option: any, id: any) => (
                        <MenuItem key={id} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    )
}
