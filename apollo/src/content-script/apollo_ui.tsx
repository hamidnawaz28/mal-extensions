import { Box, Button } from '@mui/material'
import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { getLocalStorage, runTimeMessage, updateData, waitForActiveTabLoadsRunTime } from '../common/browserMethods'
import { MESSAGING, SCRAPING_STATUS } from '../common/constants'
import { changeStatus } from '../common/services'
import { toast } from 'react-toastify'
import { DotWave } from '@uiball/loaders'
import Browser from 'webextension-polyfill'

const ButtonComponent = ({ text, onClickHandle }: any) => {
    return <Button sx={{
        color: 'white',
        width: '100%',
        padding: '3px',
        backgroundColor: '#e78e18',
        border: 'none',
        borderRadius: '4px',
        zIndex: "1000",
        '&:hover': {
            cursor: "pointer",
            color: 'black',
        }
    }}
        onClick={onClickHandle}
    >
        {text}
    </Button>
}

const uiStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gridGap: '40px',
    paddingTop: '20px',
    paddingbottom: "5px"
}

const DataCollectionUi = () => {
    const [status, setStatus] = useState(SCRAPING_STATUS.IDLE)
    const [currentPage, setCurrentpage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)

    const manageCollectionHandle = async () => {
        const collecting = status == SCRAPING_STATUS.COLLECTING
        if (collecting) {
            setStatus(SCRAPING_STATUS.IDLE)
            toast.info("Scrapper Stopped!", { autoClose: 2000 })
            await updateData({ status: SCRAPING_STATUS.IDLE })
            window.location.reload()
        }
        else {
            setStatus(SCRAPING_STATUS.COLLECTING)
            await runTimeMessage({ message: MESSAGING.INVOKE_DATA_COLLECTION })
        }
    }

    const initData = async () => {
        await updateData({ status: SCRAPING_STATUS.IDLE, currentPage: 0, totalPages: 0, totalRows: 0 })
    }


    const InnerData = () => {
        const collecting = status == SCRAPING_STATUS.COLLECTING
        return <Box>
            {
                collecting ?
                    <Box sx={{
                        display: 'flex',
                        gridGap: '20px'
                    }}>
                        <DotWave color='white' />
                        <Box>Collecting ... </Box>
                        <Box>{` ${currentPage} of ${totalPages}`} </Box>
                    </Box>
                    :
                    <Box>Collect Data</Box>
            }
        </Box>
    }

    useEffect(() => {
        initData()
        Browser.runtime.onMessage.addListener(async (request) => {
            const { message } = request
            if (message == MESSAGING.REFRESH_PAGE_DATA) {
                const ls = await getLocalStorage()
                setStatus(ls.status)
                setCurrentpage(ls.currentPage)
                setTotalPages(ls.totalPages)
            }
        })

    }, [])

    return <Box style={uiStyle}>
        <ButtonComponent text={<InnerData />} onClickHandle={manageCollectionHandle} />
    </Box>
}


const embedUi = async () => {
    await waitForActiveTabLoadsRunTime()

    setInterval(async () => {
        const apolloUi = document.querySelector("#apollo-lister-ui") as HTMLElement
        const apolloRoot = document.querySelector(".finder-results-list-panel") as HTMLElement
        if (!apolloUi && apolloRoot) {
            const rootElement = document.createElement("div")
            rootElement.id = 'apollo-lister-ui'
            apolloRoot?.prepend(rootElement)
            const root = ReactDOM.createRoot(rootElement)
            root.render(
                <React.StrictMode>
                    <DataCollectionUi />
                </React.StrictMode>
            )
        }
    }, 2000)
}

embedUi()
