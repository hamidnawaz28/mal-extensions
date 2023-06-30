import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'

export default function Input({ label, value, setValue, variant = 'outlined', ...props }: any) {
    return (
        <Box
            component="form"
            sx={{
                '& > :not(style)': { m: 1, width: '25ch' },
            }}
            noValidate
            autoComplete="off"
        >
            <TextField
                onChange={(e: any) => setValue(e.target.value)}
                label={label}
                variant={variant}
                value={value}
                {...props}
            />
        </Box>
    )
}
