import { useState } from 'react'
import { Drawer } from './Components/Drawer'
import { Header } from './Components/Header'
import { MainContainer } from './Components/MainContainer'
import { TabsPanel } from './Components/TabsPanel'
import { AddManual } from './Pages/AddManual/AddManual'
import { Calender } from './Pages/Calender/Calender'
import { Home } from './Pages/Home/Home'

export const ContentScript = ({ darkMode, setDarkMode, open, setOpen, setScanning }) => {
  const [scanResults, setScanResults] = useState([])
  return (
    <Drawer open={open} setOpen={setOpen}>
      <MainContainer>
        <Header
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          setScanning={setScanning}
          setOpen={setOpen}
          setScanResults={setScanResults}
          scanResults={scanResults}
        />
        <TabsPanel
          home={<Home scanResults={scanResults} setScanResults={setScanResults} />}
          calender={<Calender />}
          addManual={<AddManual />}
        />
      </MainContainer>
    </Drawer>
  )
}
