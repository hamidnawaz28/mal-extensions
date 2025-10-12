import { Box } from '@mui/material'
import { useEffect, useState } from 'react'
import { getTodayData, sumDayData } from '../../../common/appUtils'
import { TextLarge, TextSmall } from '../../../common/Typography'
import {
  caloriesIcon,
  cheeseIcon,
  convertInThousands,
  leafIcon,
  muscleIcon,
} from '../../../common/utils'
import { ItemSummary } from '../../Components/ItemSummary'
import { TodaySummary } from '../../Components/TodaySummary'

const nutritionItems = [
  { icon: caloriesIcon(), label: 'Calories', value: 173, unit: 'Kcl' },
  { icon: muscleIcon(), label: 'Protein', value: 34, unit: 'g' },
  { icon: leafIcon(), label: 'Carbs', value: 64, unit: 'g' },
  { icon: cheeseIcon(), label: 'Fats', value: 34, unit: 'g' },
]

export function Home({ scanResults, setScanResults }) {
  const [todayData, setTodayData] = useState([])
  const [summaryData, setSummaryData] = useState(nutritionItems)

  const updateSummaryData = async () => {
    const currentData = await sumDayData()
    const dataCopy = JSON.parse(JSON.stringify(summaryData))
    dataCopy[0].value = convertInThousands(currentData.calories)
    dataCopy[1].value = currentData.protein
    dataCopy[2].value = currentData.carbs
    dataCopy[3].value = currentData.fats
    setSummaryData(dataCopy)
  }

  const updateData = async () => {
    const data = await getTodayData()
    setTodayData(data)
    updateSummaryData()
  }

  useEffect(() => {
    updateData()
  }, [])

  return (
    <Box>
      <Box>
        <TextSmall
          sx={{
            color: 'background.primary',
          }}
        >
          Press Scan to analyse the page
        </TextSmall>
        <TextSmall
          sx={{
            color: 'text.primary',
            fontWeight: '600',
          }}
        >
          To be make accurate, make sure you have nutrition facts open
        </TextSmall>
      </Box>
      <TodaySummary data={summaryData} />

      <Box
        sx={{
          py: 1,
        }}
      >
        <TextLarge
          sx={{
            color: 'text.secondary',
            fontWeight: 600,
          }}
        >
          Today's Items
        </TextLarge>
        {todayData?.map((data, key) => {
          return (
            <ItemSummary
              data={data}
              key={key}
              updateData={updateData}
              scanResults={scanResults}
              setScanResults={setScanResults}
            />
          )
        })}
      </Box>
      <Box
        sx={{
          py: 1,
        }}
      >
        <TextLarge
          sx={{
            color: 'text.secondary',
            fontWeight: 600,
          }}
        >
          Scan Results (Per Serving)
        </TextLarge>
        {scanResults?.map((data, key) => {
          return (
            <ItemSummary
              data={data}
              key={key}
              type="scanned"
              updateData={updateData}
              scanResults={scanResults}
              setScanResults={setScanResults}
            />
          )
        })}
      </Box>
    </Box>
  )
}
