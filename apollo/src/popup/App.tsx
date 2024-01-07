
import { Box } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Popup from './Popup';

const App = () => {

  return (
    <Box>
      <ToastContainer position="bottom-right" />
      <Popup />
    </Box>
  )
}

export default App