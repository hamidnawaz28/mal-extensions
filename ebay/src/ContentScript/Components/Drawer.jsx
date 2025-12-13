import SwipeableDrawer from '@mui/material/SwipeableDrawer'
import { MAX_Z_INDEX } from '../../common/const'

export function Drawer({ children, open, setOpen }) {
  return (
    <SwipeableDrawer
      anchor={'right'}
      open={open}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      container={document.body}
      PaperProps={{
        sx: {
          zIndex: (theme) => MAX_Z_INDEX + 1200,
        },
      }}
      ModalProps={{
        keepMounted: true,
        sx: {
          zIndex: (theme) => MAX_Z_INDEX + 1200,
        },
      }}
    >
      {children}
    </SwipeableDrawer>
  )
}
