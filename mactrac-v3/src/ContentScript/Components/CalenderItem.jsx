import { Box } from '@mui/material'
import { TextLarge, TextSmall } from '../../common/Typography'
import { convertInThousands } from '../../common/utils'
import { KeyValue } from './KeyValue'

export function CalenderItem({ data }) {
  return (
    <Box
      sx={{
        py: 1,
      }}
    >
      <Box
        sx={(theme) => ({
          borderRadius: 3,
          p: '10px',
          backgroundColor: theme.palette.background.default,
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
        })}
      >
        <Box
          style={{
            display: 'grid',
            gridTemplateColumns: '15% 40% 40%',
            gap: 10,
          }}
        >
          <Box
            sx={(theme) => ({
              background: '#e3f2fd',
              borderRadius: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              py: 1,
              backgroundColor: theme.palette.background.paper,
            })}
          >
            <TextSmall>{data.dayName}</TextSmall>
            <TextLarge>{data.dayNumber}</TextLarge>
          </Box>

          <Box
            sx={() => ({
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 1,
              paddingX: 3,
            })}
          >
            <KeyValue label="Calories" value={`${convertInThousands(data.calories)} Kcl`} />
            <KeyValue label="Carbs" value={`${data.carbs} g`} />
          </Box>
          <Box
            sx={() => ({
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 1,
              paddingX: 3,
            })}
          >
            <KeyValue label="Protein" value={`${data.protein} g`} />
            <KeyValue label="Fats" value={`${data.fats} g`} />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
