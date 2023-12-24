import { ArrowUpOutlined } from '@ant-design/icons'
import { Box } from '@mui/material'
import { Button, Checkbox, Divider } from 'antd'
import type { CheckboxChangeEvent } from 'antd/es/checkbox'
import axios from 'axios'
import { useEffect, useState } from 'react'
import Browser from 'webextension-polyfill'
import { getLocalStorage, updateData } from '../common/apis'
import { updateCurrentPageUrl } from '../common/browerMethods'
import { EMOJIS } from '../common/constants'
import { Input, Select, TextArea } from './components'



const Popup = () => {

    const [description, setDescription] = useState('')
    const [apiKey, setApiKey] = useState('')
    const [emoji, setEmoji] = useState('🤘')
    const [shouldAddSellerNotes, setShouldAddSellerNotes] = useState(false)

    const helpLink = 'https://vehiclescraperandlister.com'
    const [logoUrl, setLogoUrl] = useState('')
    const [websiteUrl, setWebsiteUrl] = useState('')

    const getData = async () => {

        const getMetaDataResponse = await axios.get(`https://sag.gemquery.com/api/v1/get-api-key-info?api_key=${apiKey}`)
        const { whitelist_string, scrape_url } = getMetaDataResponse?.data

        setLogoUrl(getMetaDataResponse?.data?.logo_url)
        setWebsiteUrl(getMetaDataResponse?.data?.domain_url)

        await updateData({
            logoUrl: getMetaDataResponse?.data?.logo_url,
            websiteUrl: getMetaDataResponse?.data?.domain_url,
            helpLink: getMetaDataResponse?.data?.help_videos_url,
        })

        await updateData({ scrapperUrl: scrape_url, whitelistString: whitelist_string })
        updateCurrentPageUrl(scrape_url)
        // await updateData({ scrapperUrl: "https://www.autotrader.com/car-dealers/manassas-va-20110/70537427", whitelistString: "70537427" })
        // updateCurrentPageUrl("https://www.autotrader.com/car-dealers/manassas-va-20110/70537427")

    }

    const emojiChangeHandle = async (value: string) => {
        await updateData({ emoji: value })
        setEmoji(value)
    }

    const stockCheckHandle = async (e: CheckboxChangeEvent) => {
        await updateData({ shouldAddSellerNotes: e.target.checked })
        setShouldAddSellerNotes(e.target.checked)
    }

    const descriptionChangeHandle = async (value: string) => {
        await updateData({ description: value })
        setDescription(value)
    }

    const apiKeyChangeHandle = async (value: string) => {
        await updateData({ apiKey: value })
        setApiKey(value)
    }

    const initData = async () => {
        const data = await getLocalStorage()

        setDescription(data.description)
        setApiKey(data.apiKey)

        setEmoji(data.emoji)
        setShouldAddSellerNotes(data.shouldAddSellerNotes)
        setLogoUrl(data.logoUrl)
        setWebsiteUrl(data.websiteUrl)
    }

    useEffect(() => {
        initData()
    }, [])

    return (
        <Box sx={{ width: '750px', padding: 2 }}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexdirection: "row",
                    pb: 2,
                }}
            >
                {
                    helpLink ? <Box sx={[{
                        textDecoration: 'underline',
                        color: 'blue',
                        "&:hover": {
                            cursor: "pointer"
                        }
                    }]} onClick={() => {
                        Browser.tabs.create({
                            url: helpLink
                        });
                    }}> Help Videos</Box>
                        : null
                }

                <Box sx={{ display: 'flex', gridGap: "10px", alignItems: 'center', margin: 'auto' }}>
                    {
                        logoUrl ? <img src={logoUrl} alt="" width="50px" />
                            : null
                    }
                    <Box>Vehicle scraper and Lister</Box>
                </Box>
                {
                    websiteUrl ? <Box sx={[{
                        textDecoration: 'underline',
                        color: 'blue',
                        "&:hover": {
                            cursor: "pointer"
                        }
                    }]} onClick={() => {
                        Browser.tabs.create({
                            url: websiteUrl
                        });
                    }}> {websiteUrl}</Box>
                        : null
                }
            </Box>


            <Box sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "left"
            }}>
                <Select options={EMOJIS} setValue={emojiChangeHandle} value={emoji} label='Emoji' />
            </Box>
            <Divider style={{ margin: "5px 0" }} />
            <Box>

                <TextArea value={description} setValue={descriptionChangeHandle} placeholder='Please add your custom listing description here' label='Listing Description'
                    rows={4} sx={{ width: '100%' }} />
                <Box>
                    <Checkbox onChange={stockCheckHandle} checked={shouldAddSellerNotes}>Add dealership vehicle description</Checkbox>
                </Box>
            </Box>
            <Divider style={{ margin: "5px 0" }} />

            <br style={{ margin: "10px 0" }} />
            <Box sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: 'space-between',
                pb: 1
            }}>
                <Input label="API Key" value={apiKey} placeholder='Enter you key here' setValue={apiKeyChangeHandle} />
                <Button type="primary" icon={<ArrowUpOutlined />} onClick={getData} >
                    Select Vehicle
                </Button>
            </Box>

        </Box >
    )
}



export default Popup
