import { Box } from '@mui/material'
import { useEffect, useState } from 'react'
import { getCalendarData } from '../../../common/appUtils'
import { TextSmall } from '../../../common/Typography'
import { CalenderItem } from '../../Components/CalenderItem'
import { Settings } from '../Settings/Settings'

export function Calender() {
  const [data, setData] = useState([])
  const getCalenderData = async () => {
    const dateWiseData = await getCalendarData()
    setData(dateWiseData)
  }

  useEffect(() => {
    getCalenderData()
  }, [])

  return (
    <Box>
      <Box
        sx={{
          py: 1,
        }}
      >
        <TextSmall
          sx={{
            color: 'background.primary',
          }}
        >
          Daily Calender
        </TextSmall>
        {data.map((item, key) => (
          <CalenderItem data={item} key={key} />
        ))}
      </Box>
      <Settings />
    </Box>
  )
}
