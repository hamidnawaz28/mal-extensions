import CloseOutlinedIcon from '@mui/icons-material/CancelPresentationOutlined'
import PlayArrow from '@mui/icons-material/PlayArrow'
import { Box, Button, IconButton } from '@mui/material'
import { useEffect, useState } from 'react'
import { CHECK_USAGE_LIMIT } from '../../common/const'
import { scanHandle } from '../../common/scanUtils'
import { TextSmall } from '../../common/Typography'
import { mactracDarkLogo, mactracLogo } from '../../common/utils'
import { Switch } from './Switch'

export const Header = ({
  darkMode,
  setDarkMode,
  setScanning,
  setOpen,
  scanResults,
  setScanResults,
}) => {
  const [usageLeft, setUsageLeft] = useState(0)

  const checkUsageLeft = async () => {
    const resp = await chrome.runtime.sendMessage({ type: CHECK_USAGE_LIMIT })
    setUsageLeft(Number(resp.remaining) || 0)
  }
  const scanClickHandle = async () => {
    setOpen(false)
    const result = await scanHandle(setScanning)
    await checkUsageLeft()
    const perServing = result?.data?.perServing
    if (result?.success && perServing) {
      const updatedData = [...scanResults, { id: Date.now(), ...perServing, name: 'Scanned' }]
      setScanResults(updatedData)
    }
    setOpen(true)
  }

  useEffect(() => {
    checkUsageLeft()
  }, [])

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <img
            src={darkMode ? mactracDarkLogo() : mactracLogo()}
            alt="MacTrac Logo"
            style={{
              width: '64px',
              height: '64px',
            }}
          />
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              gap: 3,
              alignItems: 'center',
            }}
          >
            <Button
              onClick={() => scanClickHandle()}
              startIcon={
                <PlayArrow
                  sx={(theme) => ({
                    color: theme.palette.text.primary,
                  })}
                />
              }
              sx={(theme) => ({
                textTransform: 'none',
                fontSize: theme.typography.body2.fontSize,
                padding: '6px 16px',
                color: theme.palette.text.secondary,
                backgroundColor: theme.palette.background.default,
              })}
            >
              Scan
            </Button>
            <Switch check={darkMode} setCheck={setDarkMode} />
            <IconButton
              sx={{
                color: 'text.secondary',
                p: 0,
              }}
              size="20px"
              onClick={() => {
                setOpen(false)
              }}
            >
              <CloseOutlinedIcon
                fontSize="large"
                sx={{
                  padding: 0.3,
                }}
              />
            </IconButton>
          </Box>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'end',
              alignItems: 'center',
            }}
          >
            <TextSmall>Uses Left:</TextSmall>
            <TextSmall
              sx={(theme) => ({
                paddingX: '12px',
                paddingY: '5px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                color: theme.palette.text.secondary,
                backgroundColor: theme.palette.background.default,
                marginLeft: '7px',
                borderRadius: '4px',
              })}
            >{` ${usageLeft}`}</TextSmall>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
