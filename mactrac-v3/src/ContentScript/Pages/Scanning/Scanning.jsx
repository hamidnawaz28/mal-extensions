import { Box, keyframes } from '@mui/material'

import { MAX_Z_INDEX } from '../../../common/const'
import { TextSmall } from '../../../common/Typography'
import { mactracDarkLogo } from '../../../common/utils'
import { Backdrop } from '../../Components/Backdrop'

const float = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0); }
`

export const Scanning = ({ loading }) => {
  return (
    <Backdrop
      sx={{
        color: '#fff',
        gap: 2,
        position: 'relative',
        height: '100%',
        zIndex: MAX_Z_INDEX + 1500,
      }}
      open={loading}
    >
      <Box
        sx={(theme) => ({
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 2,
          alignItems: 'center',
          p: 2,
          backgroundColor: theme.palette.text.primary,
          borderRadius: 2,
          position: 'absolute',
          bottom: 10,
          left: '50%',
          transform: 'translateX(-50%)',
        })}
      >
        <img
          src={mactracDarkLogo()}
          width={'96px'}
          height={'96px'}
          alt=""
          style={{
            borderRadius: '10px',
          }}
        />
        {loading ? (
          <Box sx={{ animation: `${float} 0.5s ease-in-out infinite`, color: '' }}>
            <TextSmall
              sx={(theme) => ({
                color: theme.palette.background.paper,
              })}
            >
              ... Analysing
            </TextSmall>
          </Box>
        ) : (
          'Done'
        )}
      </Box>
    </Backdrop>
  )
}
