import { Box, GlobalStyles } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import { useState } from 'react'
import { getUserOnboardedStatus } from './common/appUtils'
import { MAX_Z_INDEX } from './common/const'
import { darkTheme, lightTheme } from './common/theme'
import { ContentScript } from './ContentScript/ContentScript'
import { FloatingIcon } from './ContentScript/Pages/FloatingIcon/FloatingIcon'
import { Scanning } from './ContentScript/Pages/Scanning/Scanning'
import { SignIn } from './ContentScript/Pages/SignIn/SignIn'

function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [open, setOpen] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [openSignIn, setOpenSignIn] = useState(false)

  const onSignInSuccessHandle = () => {
    setOpenSignIn(false)
    setOpen(true)
  }

  const iconClickHandle = async () => {
    const isUserOnBoarded = await getUserOnboardedStatus()
    if (isUserOnBoarded) {
      setOpen(true)
    } else {
      setOpenSignIn(true)
    }
  }

  return (
    <Box
      sx={{
        zIndex: MAX_Z_INDEX,
      }}
    >
      <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
        <GlobalStyles
          styles={{
            '*:focus': {
              outline: 'none !important',
              boxShadow: 'none !important',
            },
          }}
        />
        {!open ? <FloatingIcon onClick={iconClickHandle} /> : <></>}
        {openSignIn ? (
          <SignIn
            onSuccess={onSignInSuccessHandle}
            openSignIn={openSignIn}
            setOpenSignIn={setOpenSignIn}
            darkMode={darkMode}
          />
        ) : (
          <></>
        )}
        {scanning ? <Scanning loading={scanning} /> : <></>}

        <ContentScript
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          open={open}
          setOpen={setOpen}
          setScanning={setScanning}
        />
      </ThemeProvider>
    </Box>
  )
}

export default App
