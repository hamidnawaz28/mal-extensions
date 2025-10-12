import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import { styled } from '@mui/system'
import PropTypes from 'prop-types'
import * as React from 'react'

export const TabStyled = styled(Tab)(({ theme }) => ({
  fontSize: theme.typography.body2.fontSize,
  textTransform: 'none',
  '&.Mui-selected': {
    color: theme.palette.text.primary,
    fontWeight: '700',
  },
}))

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
      sx={{
        padding: '0px',
      }}
    >
      {value === index && <Box sx={{ pt: '15px' }}>{children}</Box>}
    </Box>
  )
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

export function TabsPanel({ home, calender, addManual }) {
  const [value, setValue] = React.useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <Box sx={{ width: '100%', pt: 1 }}>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          fontSize: '12px',
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="tab-panel"
          TabIndicatorProps={{
            style: {
              backgroundColor: '#000', // underline color black
            },
          }}
        >
          <TabStyled label="Home" {...a11yProps(0)} />
          <TabStyled label="Calendar" {...a11yProps(1)} />
          <TabStyled label="Add Manual" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        {home}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        {calender}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        {addManual}
      </CustomTabPanel>
    </Box>
  )
}
