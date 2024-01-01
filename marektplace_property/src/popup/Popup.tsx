import { Box, IconButton, Typography } from '@mui/material'
import { Button } from 'antd'
import { useEffect, useState } from 'react'
import { getLocalStorage, updateLocalData } from '../common/apis'
import { getAuthToken } from '../common/googleApis'
import Browser from 'webextension-polyfill'
import { HelpCenter } from '@mui/icons-material'
const Popup = () => {

    const [spreadsheetId, setSpreadsheetid] = useState('')
    const [token, setToken] = useState('')

    const collectDataHandle = async () => {
        const auth = await getAuthToken()
        setToken(auth?.token ?? '')
    }

    const initData = async () => {
        const data = await getLocalStorage()
        setSpreadsheetid(data.spreadsheetId)
    }

    const onOpenHandle = () => {
        Browser.tabs.create({ url: `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit` })
    }
    useEffect(() => {
        initData()
    }, [])

    return (
        <Box sx={{ width: '400px', padding: 2 }}>
            {/* <Box sx={{ p: 3 }}>
                {token}
            </Box> */}
            <Header />
            <Typography sx={{
                padding: "10px",
                fontSize: '20px',
                textAlign: "center"
            }}>
                House Rental Danang
            </Typography>
            <Typography sx={{
                padding: "3px",
                fontSize: '12px',
                textAlign: "center"
            }}>
                On batch collection we always create a new google sheet, but on single collection data will be stored in the current sheet
            </Typography>
            <Typography sx={{
                padding: "3px",
                fontSize: '12px',
                textAlign: "center"
            }}>
                Please click on the below button to navigate to the sheet file, after collecting the data.
            </Typography>

            <Box>
                {
                    !!spreadsheetId ? <Button onClick={onOpenHandle}>
                        Open Excel
                    </Button> : null
                }

            </Box>
        </Box>
    )
}

export default Popup

const Header = () => {
    return <Box sx={{
        height: 30,
        backgroundColor: "rgb(239 239 239)",
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: "center",
        padding: '5px 10px',
        marginBottom: "20px"
    }}>
        <img src="logo.png" alt="" height={"100%"} />
        <IconButton aria-label="delete" onClick={() =>
            Browser.tabs.create({ url: "https://houserentaldanang.com/" })}>
            <HelpCenter />
        </IconButton>
    </Box>
}
