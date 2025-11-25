import { Box } from '@mui/material'
import Browser from 'webextension-polyfill'
import { adData, logoUrl } from './const'

const AdItem = ({ data }: any) => {
  const adClickHandle = () => {
    Browser.tabs.create({ url: data.url })
  }

  return <Box className="ad-item" onClick={adClickHandle}></Box>
}

const App = () => {
  return (
    <Box>
      <Header />
      <Box className="main-continer">
        <img src={logoUrl} alt="" className="app-logo" />
        <Box className="ad-container">
          {adData.map((item, key): any => (
            <AdItem data={item} key={key} />
          ))}
        </Box>
      </Box>
      <Footer />
    </Box>
  )
}

export default App

const Header = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: 'rgba(73, 127, 32, 1)',
      color: 'black',
      padding: '5px 15px',
      top: 0,
      zIndex: 1000,
      height: '20px',
    }}
  ></Box>
)

const Footer = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'space-between',
      backgroundColor: 'rgba(73, 127, 32, 1)',
      color: 'white',
      padding: '0px 15px',
      height: '30px',
    }}
  ></Box>
)
