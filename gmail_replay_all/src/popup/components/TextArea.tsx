
import { Box, Typography } from '@mui/material'

const TextArea = ({ setText, label, text }: any) => {

    return (
        <Box>
            <Typography variant="subtitle2">{label}</Typography>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                }}
            >
                <Typography color="text.secondary" variant="body2" gutterBottom>
                    {text}
                </Typography>


            </Box>
        </Box>
    )
}
export default TextArea
