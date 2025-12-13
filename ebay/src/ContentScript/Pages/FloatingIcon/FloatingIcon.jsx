import { IconButton } from '@mui/material'
import { MAX_Z_INDEX } from '../../../common/const'
import { mactracDarkLogo } from '../../../common/utils'

export const FloatingIcon = ({ onClick }) => {
  return (
    <IconButton
      onClick={onClick}
      sx={(theme) => ({
        position: 'fixed',
        bottom: 16,
        right: 16,
        color: theme.palette.common.white,
        '&:hover': {
          transform: 'translateY(-2px)',
        },
        zIndex: MAX_Z_INDEX,
      })}
    >
      <img
        src={mactracDarkLogo()}
        width={'55px'}
        height={'55px'}
        alt=""
        style={{
          borderRadius: '10px',
        }}
      />
    </IconButton>
  )
}
