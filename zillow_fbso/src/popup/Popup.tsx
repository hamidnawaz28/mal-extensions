import { AttachMoney, Bathtub, Delete, DownloadForOffline, HelpCenter, LocalHotel, LocationOn, Phone, RotateLeft, Straighten } from '@mui/icons-material'
import { Box, Button, IconButton, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import Browser from 'webextension-polyfill'
import { apiFactory } from '../common/apis'
import { getLocalStorage, updateData } from '../common/browerMethods'
import { LISTING_TYPES } from '../common/constants'
import { downloadListings, downloadReviews } from '../common/utils'
import { Input, Select } from './components'

const Popup = () => {

    const [fbPageUrl, setFbPageUrl] = useState('')
    const [apiKey, setApiKey] = useState('')
    const [listingType, setListingType] = useState(LISTING_TYPES[0].value)
    const [listingTypeDetails, setListingTypeDetails] = useState('')

    const [propsData, setPropsData] = useState([])

    const typeChangeHandle = async (value: string) => {
        await updateData({ listingType: value })
        setListingType(value)
    }

    const fbPageUrlChangeHandle = async (value: string) => {
        await updateData({ fbPageUrl: value })
        setFbPageUrl(value)
    }

    const fetchData = async () => {
        if (listingType == LISTING_TYPES[0].value) {
            const data = await apiFactory.getListings()
            const listing = data?.real_estate_listings ?? []
            setPropsData(listing)

        }
        else {
            const data = await apiFactory.getReviews()
            console.log(data);
            const listing = data?.real_estate_reviews ?? []
            setPropsData(listing)
        }
    }

    const apiKeyChangeHandle = async (apiKey: string) => {
        await fetchData()
        await updateData({ apiKey })
        setApiKey(apiKey)
    }

    const initData = async () => {
        const data = await getLocalStorage()
        setFbPageUrl(data.fbPageUrl)
        setApiKey(data.apiKey)
        setListingType(data.listingType)

        const type = LISTING_TYPES.find(el => el.value == data.listingType)
        setListingTypeDetails(type?.detailsText ?? '')

        await fetchData()
    }

    const deleteAllHandle = async () => {
        listingType == LISTING_TYPES[0].value ? await apiFactory.deleteAllListings() : await apiFactory.deleteAllReviews()
        initData()
    }

    const downloadHandle = async () => {
        listingType == LISTING_TYPES[0].value ? downloadListings(propsData) : downloadReviews(propsData)
    }

    const refreshDataHandle = () => {
        initData()
    }
    useEffect(() => {
        initData()
    }, [listingType, apiKey])

    return (
        <Box sx={{ width: '600px', padding: '5px' }}>
            <Header />
            <Box sx={{
                display: "flex",
                flexDirection: "column",
                gridGap: '10px'
            }}>
                <Select options={LISTING_TYPES} setValue={typeChangeHandle} value={listingType} label='Listing Type' />
                <Typography sx={{
                    fontSize: '12px'
                }}>
                    {listingTypeDetails}
                </Typography>
                {
                    listingType == LISTING_TYPES[0].value ? <Input label="Fb Page Link" value={fbPageUrl} placeholder='Enter your facebook page link here' setValue={fbPageUrlChangeHandle} /> : null
                }

                <Input label="API Key" value={apiKey} placeholder='Enter your key here' setValue={apiKeyChangeHandle} />

                <Box sx={{
                    display: 'flex',
                    flexDirection: "row",
                    gridGap: "20px"
                }}>
                    <Button variant="outlined" startIcon={<RotateLeft />} onClick={refreshDataHandle} size='small' color='success'>Refresh</Button>
                    <Button variant="outlined" startIcon={<DownloadForOffline />} size='small' onClick={downloadHandle}> Download</Button>
                    <Button variant="outlined" startIcon={<Delete />} onClick={deleteAllHandle} size='small' color='error'> Delete All</Button>
                </Box>
                {
                    propsData?.map((el, id) => listingType == LISTING_TYPES[0].value ? <ListingCard data={el} key={id} initData={initData} /> : <ReviewsCard data={el} key={id} />)
                }
            </Box>
        </Box >
    )
}


const ListingCard = ({ data, initData }: any) => {
    const id = data?.id
    const image = data?.image
    const price = data?.price
    const address = data?.address
    const bedrooms = data?.bedrooms
    const baths = data?.baths
    const sq_ft = data?.sq_ft
    const seller_phone_number = data?.seller_phone_number
    const zillow_listing_url = data?.zillow_listing_url

    const deleteListingHandle = async (id: any) => {
        await apiFactory.deleteListing(id)
        initData()
    }
    return <Box sx={{
        display: 'grid',
        gridTemplateColumns: "60% 40%",
        borderRadius: "10px",
        boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"
    }}>
        <Box sx={{
            height: "180px"
        }}>
            <img src={image} style={{
                borderRadius: "10px",
                width: "100%",
                height: "100%",
                objectFit: "cover"
            }} alt="" loading='lazy' />
        </Box>
        <Box sx={{
            padding: "5px"
        }}>
            <Box >
                <Box sx={{
                    display: "grid",
                    gridTemplateColumns: "50% 50%"
                }}>
                    <IconText text={price} icon={<AttachMoney />} />
                    <IconText text={sq_ft} icon={<Straighten />} />
                    <IconText text={parseInt(bedrooms)} icon={<LocalHotel />} />
                    <IconText text={parseInt(baths)} icon={<Bathtub />} />
                </Box>
                <IconText text={address} icon={<LocationOn />} />
                <IconText text={seller_phone_number} icon={<Phone />} />
            </Box>
            <Box sx={{
                width: '100%',
                display: "flex",
                justifyContent: 'end',
            }
            }>
                <Button variant='contained' size='small' color='error' sx={{
                    fontSize: '12px'
                }}
                    onClick={() => deleteListingHandle(id)}>
                    Delete
                </Button>
            </Box>
        </Box>
    </Box >
}

const ReviewsCard = ({ data }: any) => {

    const id = data?.id
    const date = data?.date
    const reviewer_name = data?.reviewer_name
    const local_knowledge = data?.local_knowledge
    const process_expertise = data?.process_expertise
    const responsiveness = data?.responsiveness
    const negotiation_skills = data?.negotiation_skills
    const total_score = data?.total_score
    const headline = data?.headline
    const body = data?.body

    return <Box style={{
        display: 'grid',
        gridTemplateColumns: "60% 40%",
        boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
        padding: '10px',
        borderRadius: "5px"
    }}>
        <Box>
            <Typography variant='subtitle1' fontWeight={'bold'} sx={{
                fontSize: "14px",

            }}>
                {headline}
            </Typography>
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                fontSize: "12px",
            }}>
                <Typography sx={{
                    fontSize: "11px",
                }}>
                    {reviewer_name}
                </Typography>
                <Typography sx={{
                    fontSize: "11px",
                }}>
                    {date}
                </Typography>
            </Box>
            <Typography variant='body2' sx={{
                fontSize: "11px",

            }}>
                {body}
            </Typography>
        </Box>
        <Box sx={{
            padding: '10px',
            paddingLeft: "25px"
        }}>
            <Box sx={{
                display: 'flex',
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                fontSize: '12px',
                borderBottom: "1px solid grey",
                marginBottom: "5px"
            }}>
                <Typography sx={{
                    fontSize: "11px"
                }}>
                    {parseInt(total_score)}
                </Typography>
                <Typography sx={{
                    fontSize: "11px"
                }}>
                    Overall
                </Typography>
            </Box>
            <Box>
                <TextNumber text={"Local Knowledge"} number={local_knowledge} />
                <TextNumber text={" Process Expertise"} number={process_expertise} />
                <TextNumber text={"Responsiveness"} number={responsiveness} />
                <TextNumber text={"Negotiation Skills"} number={negotiation_skills} />
            </Box>
        </Box>

    </Box>
}

const TextNumber = ({ text, number }: any) => {
    return <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
    }}>
        <Typography sx={{
            fontSize: "11px"
        }}>
            {text}
        </Typography>
        <Typography sx={{
            fontSize: "11px"
        }}>
            {parseInt(number)}
        </Typography>
    </Box>
}

const IconText = ({ text, icon }: any) => {
    return <Box sx={{
        display: 'flex',
        flexDirection: "rows",
        placeItems: 'center'

    }}>
        <Box sx={{
            display: 'flex',
            placeItems: 'center',
            py: '2px',
            color: '#8c939d'
        }}>
            {icon}
        </Box>
        <Typography sx={{
            fontSize: '12px',
            paddingLeft: "5px"
        }}>
            {text}
        </Typography>
    </Box>
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
        <img src="FSBO.png" alt="" height={"100%"} />
        <IconButton aria-label="delete" onClick={() =>
            Browser.tabs.create({ url: "http://www.realestatescrape.com/" })}>
            <HelpCenter />
        </IconButton>
    </Box>
}
export default Popup
