import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  CircularProgressProps,
  Typography,
} from '@mui/material'

// import Browser from 'webextension-polyfill';
import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import { setLocalStorage, updateProcessingStatus } from '../common/browserMethods'
import { extractAdData, sortAdsByReach } from './helpers'

const ContentScript = () => {
  const [open, setOpen] = React.useState(false)

  const startProcess = async () => {
    await updateProcessingStatus(true)
    setOpen(true)
  }
  const stopProcess = async () => {
    await updateProcessingStatus(false)
    setOpen(false)
  }
  const handleSortData = () => {
    sortAdsByReach()
  }

  const handleExtractAdData = () => {
    startProcess()
  }
  const [progress, setProgress] = React.useState(10)

  const updateLsStorage = async (data: any) => {
    await setLocalStorage(data)
  }

  useEffect(() => {
    if (open) {
      extractAdData(setProgress, stopProcess)
    }
  }, [open])
  useEffect(() => {
    updateLsStorage({ data: [], isProcessing: false })
  }, [])

  return (
    <Box
      sx={{
        paddingLeft: '2%',
        paddingY: '5px',
        backgroundColor: 'white',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          gap: 1,
        }}
      >
        <Button variant="contained" size="small" onClick={handleExtractAdData}>
          Scrap Data
        </Button>
        <Button variant="contained" size="small" onClick={handleSortData}>
          Sort
        </Button>
      </Box>
      <LoaderBackdrop
        open={open}
        handleClose={stopProcess}
        progress={progress}
        setProgress={setProgress}
      ></LoaderBackdrop>
    </Box>
  )
}

export default ContentScript

function CircularProgressWithLabel(props: CircularProgressProps & { value: number }) {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress
        variant="determinate"
        {...props}
        sx={{
          color: 'white',
        }}
        size={60}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box>
          <Typography variant="caption" component="div" sx={{ color: 'white', fontSize: '18px' }}>
            {`${Math.round(props.value)}%`}
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

function LoaderBackdrop({
  open,
  handleClose,
  children,
  progress,
}: {
  open: boolean
  handleClose: () => void
  children?: React.ReactNode
  progress: number
  setProgress: React.Dispatch<React.SetStateAction<number>>
}) {
  return ReactDOM.createPortal(
    <Backdrop
      sx={{
        color: '#fff',
        zIndex: 999999999,
        position: 'fixed',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
      open={open}
    >
      {children}
      <CircularProgressWithLabel value={progress} />
      <Button
        onClick={handleClose}
        sx={{
          color: 'white',
        }}
      >
        Stop
      </Button>
    </Backdrop>,
    document.body,
  )
}
