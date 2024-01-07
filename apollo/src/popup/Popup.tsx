

import { Box, Button, Typography } from '@mui/material';
import { DotWave } from '@uiball/loaders';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Browser from "webextension-polyfill";
import { MESSAGING, SCRAPING_STATUS } from '../common/constants';
import { changeStatus } from '../common/services';
import { downloadApolloData } from '../common/utils';
import { getLocalStorage } from '../common/browserMethods';
import { DownloadForOffline } from '@mui/icons-material';

const ExportCard = ({ count, text }: any) => <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gridGap: 30, backgroundColor: '#e07a5f', color: 'white', padding: 1, borderRadius: 2, width: '-webkit-fill-available' }}>
    <Typography sx={{ fontSize: 30, lineHeight: 1 }}>{count}</Typography>
    <Typography fontWeight={'bold'} sx={{ whiteSpace: 'nowrap', fontSize: '10px' }}>
        {text}
    </Typography>
</Box>



function ExportPage() {

    const [data, setData] = useState([])
    const [currentPage, setCurrentpage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [totalRows, setTotalRows] = useState(0)


    const [status, setStatus] = useState(SCRAPING_STATUS.IDLE)



    const updateData = async () => {
        const ls = await getLocalStorage()
        setData(ls.data)
        setStatus(ls.status)
        setCurrentpage(ls.currentPage)
        setTotalPages(ls.totalPages)
        setTotalRows(ls.totalRows)
    }

    const downloadData = async () => {
        if (data.length > 0) {
            await downloadApolloData(data)
            toast.success("Downloaded", { autoClose: 2000 })
        }
        else {
            toast.info("Data not available, please collect!", { autoClose: 2000, })
        }
    }

    useEffect(() => {
        updateData()
        Browser.runtime.onMessage.addListener((request) => {
            const { message } = request
            if (message == MESSAGING.FETCH_REFRESH_DATA) {
                updateData()
            }
        })
    }, [])

    const style = {
        width: "100%",
        display: "grid",
        gridTemplateColumns: "repeat(2, 125px)",
        justifyContent: "space-between",
        textAlign: "center",
    }

    return (
        <Box  >
            <Header />
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gridGap: "10px" }}>
                <Box sx={style}>
                    <ExportCard count={totalPages} text='Total Pages' />
                    <ExportCard count={currentPage} text='Current page' />
                </Box>
                <Box sx={style}>
                    <ExportCard count={totalRows} text='Total Rows' />
                    <ExportCard count={data.length} text='Rows Collected' />
                </Box>

                <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
                    <Button variant="outlined" startIcon={<DownloadForOffline />} size='small' onClick={downloadData}> Download As CSV</Button>
                </Box>
            </Box >

        </Box>
    );
}

const Header = () => {
    return <Box sx={{
        height: 30,
        backgroundColor: "rgb(239 239 239)",
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: "center",
        padding: '5px 10px',
        marginBottom: "10px"
    }}>
        <img src="logo.png" alt="" height={"100%"} />
    </Box>
}
export default ExportPage;
