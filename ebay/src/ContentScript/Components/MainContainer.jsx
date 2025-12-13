import { Box } from '@mui/material'

export function MainContainer({ children }) {
  return (
    <Box
      sx={{
        padding: 2,
        backgroundColor: 'background.paper',
        width: '500px',
      }}
    >
      {children}
    </Box>
  )
}
