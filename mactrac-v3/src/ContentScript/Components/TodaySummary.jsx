import { Box } from '@mui/material'

import { H2, TextSmall } from '../../common/Typography'

export function TodaySummary({ data }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 1,
        py: '10px',
      }}
    >
      {data.map((item, key) => (
        <SummaryItem itemDetail={item} key={key} />
      ))}
    </Box>
  )
}

const SummaryItem = ({ itemDetail }) => {
  return (
    <Box
      key={itemDetail.label}
      sx={(theme) => ({
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderRadius: 6,
        py: '20px',
        backgroundColor: theme.palette.background.default,
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',

        ...(theme.palette.mode !== 'dark' && {
          '&:hover': {
            backgroundColor: theme.palette.primary.main,
          },
        }),
      })}
    >
      <Box
        sx={(theme) => ({
          borderRadius: '50%',
          backgroundColor: theme.palette.background.paper,
          padding: '5px',
          display: 'flex',
          ...(theme.palette.mode === 'dark' && {
            backgroundColor: theme.palette.text.secondary,
          }),
        })}
      >
        <img src={itemDetail.icon} alt="" width={'100%'} height={'100%'} />
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          pt: 1,
          pb: 1,
          alignItems: 'baseline',
        }}
      >
        <H2
          sx={{
            margin: '0px',
            fontWeight: '600',
          }}
        >{`${itemDetail.value}`}</H2>
        <TextSmall
          sx={{
            m: 0,
            height: '100%',
            lineHeight: 1,
            fontWeight: 600,
            ml: '2px',
          }}
        >{`${itemDetail.unit}`}</TextSmall>
      </Box>

      <TextSmall>{`${itemDetail.label}`}</TextSmall>
    </Box>
  )
}
