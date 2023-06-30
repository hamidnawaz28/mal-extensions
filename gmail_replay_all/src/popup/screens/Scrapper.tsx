import { Box, TextField, Typography } from '@mui/material'
import { ActionButton } from './../components'
import { useState, useEffect } from 'react'
import { tabMesage } from '../../common/browerMethods'
import { MESSAGING } from '../../common/constants'
import Browser from 'webextension-polyfill'
import { getAllProfiles } from '../../common/apis'
import { downloadExcel } from '../../common/utils'

const ContentScript = () => {
    const [pagesToScrap, setPagesToScrap] = useState(10)
    const [profiles, setProfiles] = useState([])
    const onStartHandle = async () => {
        await tabMesage({
            message: MESSAGING.START_CAMPAIGN,
            data: { pagesToScrap }
        })
    }
    const exelData = profiles.map((profile: any) => {
        return ([profile.profileUrl])
    })
    const fileDownloadHandle = async () => {
        downloadExcel("Profiles", ["Profile Url"], exelData)
    }
    const numberOfPagesChangeHandle = (e: any) => {
        setPagesToScrap(e.target.value)
    }
    const requestedProfiles = pagesToScrap * 10
    const scrappedProfiles = profiles.length
    const remainingProfiles = requestedProfiles - scrappedProfiles

    useEffect(() => {
        Browser.runtime.onMessage.addListener(async function (request) {
            const { message } = request
            if (message === MESSAGING.GET_ALL_PROFILES) {
                const allProfiles = await getAllProfiles()
                setProfiles(allProfiles)
            }
        })
    }, [])

    return (
        <Box>
            <Box sx={{
                display: "flex",
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                gridGap: 20
            }}>
                <Box sx={{
                    p: 10
                }}>

                    <img
                        src={'logo.png'}
                        width='100px'
                        alt=''
                    />
                </Box>
                <TextField
                    label="Number of pages"
                    type="number"
                    onChange={numberOfPagesChangeHandle}
                    value={pagesToScrap}
                    variant="filled"
                    disabled={false}
                />
                <ActionButton label="Start" onClick={onStartHandle} disabled={false} />
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gridGap: 10
                }}>
                    <Box>
                        <Typography>
                            Expected
                        </Typography>
                        <Typography>
                            {
                                requestedProfiles
                            }
                        </Typography>
                    </Box>
                    <Box>
                        <Typography>
                            Scrapped
                        </Typography>
                        <Typography>
                            {
                                scrappedProfiles
                            }
                        </Typography>
                    </Box><Box>
                        <Typography>
                            Remaining
                        </Typography>
                        <Typography>
                            {
                                remainingProfiles
                            }
                        </Typography>
                    </Box>
                </Box>
                <ActionButton label="Download Profiles" onClick={fileDownloadHandle} disabled={false} />
            </Box>
        </Box>
    )
}

export default ContentScript