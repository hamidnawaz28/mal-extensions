import { Backdrop as MuiBackdrop } from '@mui/material'
import { MAX_Z_INDEX } from '../../common/const'

export function Backdrop({ open, children }) {
  return (
    <MuiBackdrop
      sx={{
        color: '#fff',
        position: 'fixed',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        zIndex: MAX_Z_INDEX,
      }}
      open={open}
    >
      {children}
    </MuiBackdrop>
  )
}
