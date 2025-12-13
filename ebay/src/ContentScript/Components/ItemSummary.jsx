import ControlPointIcon from '@mui/icons-material/ControlPoint'
import { Box } from '@mui/material'
import { useState } from 'react'
import { deleteDataById, saveManualData } from '../../common/appUtils'
import { convertInThousands, trashIcon } from '../../common/utils'
import { KeyValue } from './KeyValue'
import { Snackbar } from './Snackbar'

export function ItemSummary({ data, updateData, type, scanResults, setScanResults }) {
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [deleteStatus, setDeleteStatus] = useState(false)

  const onTrashHandle = async (id) => {
    if (type == 'scanned') {
      const filteredResults = scanResults.filter((item) => item.id != id)
      setScanResults(filteredResults)
    } else {
      await deleteDataById(id)
    }
    setDeleteStatus(true)
    updateData()
  }

  const onAddHandle = async (dataData) => {
    await saveManualData(dataData)
    const filteredResults = scanResults.filter((item) => item.id != dataData.id)
    setScanResults(filteredResults)
    setSnackbarOpen(true)
    updateData()
  }

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
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 16,
          }}
        >
          <Box
            sx={(theme) => ({
              background: '#e3f2fd',
              borderRadius: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              py: 2,
              backgroundColor: theme.palette.background.paper,
            })}
          >
            {data.name}
          </Box>

          <Box
            sx={() => ({
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 1,
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
            })}
          >
            <KeyValue label="Protein" value={`${data.protein} g`} />
            <KeyValue label="Fats" value={`${data.fats} g`} />
          </Box>

          <Box
            sx={() => ({
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '3px',
            })}
          >
            {type == 'scanned' ? (
              <ControlPointIcon
                onClick={() => onAddHandle(data)}
                src={trashIcon()}
                alt="MacTrac Logo"
                style={{
                  width: '20px',
                  height: '20px',
                  cursor: 'pointer',
                }}
              />
            ) : (
              <></>
            )}
            <img
              onClick={() => onTrashHandle(data.id)}
              src={trashIcon()}
              alt="MacTrac Logo"
              style={{
                width: '20px',
                height: '20px',
                cursor: 'pointer',
              }}
            />
          </Box>
        </Box>
      </Box>
      <Snackbar
        label={'Item deleted!'}
        severity={'success'}
        open={deleteStatus}
        setOpen={setDeleteStatus}
      />
      <Snackbar
        label={'Item Added!'}
        severity={'success'}
        open={snackbarOpen}
        setOpen={setSnackbarOpen}
      />
    </Box>
  )
}
