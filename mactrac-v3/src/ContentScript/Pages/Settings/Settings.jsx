import { Box } from '@mui/material'
import { useEffect, useState } from 'react'
import { getSettings, saveSettings } from '../../../common/appUtils'
import { Button } from '../../Components/Button'
import { Input } from '../../Components/Input'
import { Select } from '../../Components/Select'
import { Snackbar } from '../../Components/Snackbar'

export function Settings() {
  const [maintanance, setMaintanance] = useState(2000)
  const [desiredIntake, setDesiredIntake] = useState(2000)
  const [startDate, setStartDate] = useState('')
  const [startWeight, setStartWeight] = useState(180)
  const [unit, setUnit] = useState(0)

  const [snackbarOpen, setSnackbarOpen] = useState(false)

  const onSaveSettings = async () => {
    const data = {
      maintanance,
      desiredIntake,
      startDate,
      startWeight,
      unit,
    }
    await saveSettings(data)
    setSnackbarOpen(true)
  }

  const initSettings = async () => {
    const currentSettings = await getSettings()
    setMaintanance(currentSettings.maintanance)
    setDesiredIntake(currentSettings.desiredIntake)
    setStartDate(currentSettings.startDate)
    setStartWeight(currentSettings.startWeight)
    setUnit(currentSettings.unit)
  }

  useEffect(() => {
    initSettings()
  }, [])

  return (
    <Box>
      <Box
        sx={() => ({
          display: 'grid',
          gridTemplateColumns: 'repeat(2,1fr)',
          gap: 2,
          pt: 2,
        })}
      >
        <Input
          label={'Maintanance (Kcl/Day)'}
          value={maintanance}
          setValue={setMaintanance}
          type="number"
          placeholder={maintanance}
        />
        <Input
          label={'Desired Intake (Kcl/Day)'}
          value={desiredIntake}
          setValue={setDesiredIntake}
          type="number"
          placeholder={desiredIntake}
        />
        <Input
          label={'Start Date'}
          value={startDate}
          setValue={setStartDate}
          type="date"
          placeholder={startDate}
        />
        <Input
          label={'Start Weight'}
          value={startWeight}
          setValue={setStartWeight}
          type="number"
          placeholder={startWeight}
        />
      </Box>
      <Box
        sx={{
          paddingTop: 2,
        }}
      >
        <Select
          value={unit}
          setValue={setUnit}
          label={'Unit'}
          options={[
            {
              label: 'lb',
              value: 0,
            },
            {
              label: 'kg',
              value: 1,
            },
          ]}
        />
      </Box>
      <Box
        sx={{
          paddingTop: 2,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Button onClick={onSaveSettings} label={'Save Settings'} />
      </Box>
      <Snackbar
        label={'Settings saved'}
        severity={'success'}
        open={snackbarOpen}
        setOpen={setSnackbarOpen}
      />
    </Box>
  )
}
