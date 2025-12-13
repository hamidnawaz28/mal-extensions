import { Box } from '@mui/material'
import { useState } from 'react'
import { saveManualData } from '../../../common/appUtils'
import { TextSmall } from '../../../common/Typography'
import { Button } from '../../Components/Button'
import { Input } from '../../Components/Input'
import { Snackbar } from '../../Components/Snackbar'

export function AddManual() {
  const [name, setName] = useState('Burger')
  const [calories, setCalories] = useState(2000)
  const [protein, setProtein] = useState(52)
  const [carbs, setCarbs] = useState(22)
  const [fats, setFats] = useState(12)

  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const onSaveManual = async () => {
    const id = Date.now()
    const item = { id, name, calories, protein, carbs, fats }
    await saveManualData(item)
    setSnackbarOpen(true)
  }

  return (
    <Box>
      <TextSmall
        sx={(theme) => ({
          color: theme.palette.text.secondary,
          py: 1,
          fontWeight: 400,
          fontSize: 13,
        })}
      >
        Add Manual Entry
      </TextSmall>
      <Box
        sx={() => ({
          display: 'grid',
          gridTemplateColumns: 'repeat(2,1fr)',
          gap: 2,
        })}
      >
        <Input label={'Name'} value={name} setValue={setName} type="text" placeholder={'Burger'} />
        <Input
          label={'Calories'}
          value={calories}
          setValue={setCalories}
          type="number"
          placeholder={calories}
        />
        <Input
          label={'Protein (g)'}
          value={protein}
          setValue={setProtein}
          type="number"
          placeholder={protein}
        />
        <Input
          label={'Carbs (g)'}
          value={carbs}
          setValue={setCarbs}
          type="number"
          placeholder={carbs}
        />
        <Input
          label={'Fats (g)'}
          value={fats}
          setValue={setFats}
          type="number"
          placeholder={fats}
        />
      </Box>
      <Box
        sx={{
          paddingTop: 2,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Button onClick={() => onSaveManual()} label={'Add Manual'} />
      </Box>
      <Snackbar
        label={'Item saved'}
        severity={'success'}
        open={snackbarOpen}
        setOpen={setSnackbarOpen}
      />
    </Box>
  )
}
