import { Box, Button } from '@mui/material'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { MESSAGING } from '../common/constants'
import { waitForActiveTabLoadsRunTime, runTimeMessage } from '../common/browerMethods'

const ButtonComponent = ({ text, onClickHandle }: any) => {
    return <Button sx={{
        color: 'white',
        width: '100%',
        padding: '3px',
        backgroundColor: '#e78e18',
        border: 'none',
        borderRadius: '4px',
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


const BatchCollectButton = () => {
    const collectDataHandle = () => { runTimeMessage({ message: MESSAGING.INVOKE_BATCH_DATA_COLLECTION }) }

    return <Box style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gridGap: '40px',
        paddingTop: '20px'
    }}>
        <ButtonComponent text='Collect Batch Data' onClickHandle={collectDataHandle} />
    </Box>
}

const SingleCollectButton = () => {
    const collectDataHandle = () => { runTimeMessage({ message: MESSAGING.INVOKE_SINGLE_DATA_COLLECTION }) }

    return <Box style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gridGap: '40px',
        paddingTop: '20px'
    }}>
        <ButtonComponent text='Collect Single Data' onClickHandle={collectDataHandle} />
    </Box>
}

const embedUi = async () => {
    await waitForActiveTabLoadsRunTime()
    setInterval(async () => {
        const collectorBatchUi = document.querySelector("#collector-batch-ui") as HTMLElement
        const collectorSingleUi = document.querySelector("#collector-single-ui") as HTMLElement

        const selectedSingleElement: any = document.querySelector("[aria-label='Message']")?.parentElement?.parentElement?.parentElement?.parentElement
        const selectedBatchElement = document.querySelectorAll("#seo_pivots")?.[1] as HTMLElement
        if (!collectorBatchUi && selectedBatchElement) {
            const rootElement = document.createElement("div")
            rootElement.id = 'collector-batch-ui'
            selectedBatchElement?.append(rootElement)
            const root = ReactDOM.createRoot(rootElement)
            root.render(
                <React.StrictMode>
                    <BatchCollectButton />
                </React.StrictMode>
            )
        }
        if (!collectorSingleUi && selectedSingleElement) {
            const rootElement = document.createElement("div")
            rootElement.id = 'collector-single-ui'
            selectedSingleElement?.prepend(rootElement)
            const root = ReactDOM.createRoot(rootElement)
            root.render(
                <React.StrictMode>
                    <SingleCollectButton />
                </React.StrictMode>
            )
        }
    }, 2000)

}

embedUi()