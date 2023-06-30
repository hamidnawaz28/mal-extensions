

import { useEffect, useState } from 'react';
import {
    ExpandMore as ExpandMoreIcon,
    RestartAlt,
    Home as HomeIcon
} from '@mui/icons-material';

import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Typography,
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    FormGroup,
} from '@mui/material'

import { getLocalStorage, addNumber, removeNumber, setLocalStorage } from '../common/browerMethods';
import { EXTENSION_DATA1 } from '../common/constants';
import Browser from 'webextension-polyfill';
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import { setUsersData, getUsersData } from '../firebase/api';

const Popup = () => {
    const [extensionData, setExtensionData] = useState<any>({})
    const [opened, setOpened] = useState<any>(null)
    const [progress, setProgress] = useState(0)
    const initData = async () => {
        const selectedList = await getLocalStorage()
        // const newData = { ...EXTENSION_DATA }
        const newData: any = await getUsersData("K6mJIankQ30m8fIwa5gv")
        let total = 0
        let checked = 0
        const dataWithCheckStatus = newData.groups.map((group: any) => {
            const checklists = group.checklists.map((checklistItem: any) => {
                total += 1
                const ifChecked = selectedList.includes(checklistItem.checklistId)
                if (ifChecked) checked += 1
                return ({
                    ...checklistItem,
                    selected: ifChecked
                })
            })
            return ({
                ...group, checklists
            })
        })
        setProgress((checked / total) * 100)
        newData.groups = dataWithCheckStatus
        setExtensionData(newData)
    }

    useEffect(() => {
        initData()
        setUsersData("K6mJIankQ30m8fIwa5gv", EXTENSION_DATA1)
    }, [])

    const checkboxHandle = async (checklistId: number, state: boolean) => {
        if (state) await removeNumber(checklistId)
        else await addNumber(checklistId)
        initData()
    }

    return (
        <Box sx={{ width: '500px' }}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: '#8fc3bd',
                    color: 'black',
                    padding: '5px 15px',
                    position: 'sticky',
                    top: 0,
                    zIndex: 1000,
                }}
            >
                <img src={'logo.png'} alt="" height="15px" />
                <Box sx={{ fontSize: '0.875rem', fontWeight: 'bold' }}>
                    Youtube Checklist
                </Box>
                <Button startIcon={<HomeIcon />} onClick={() => Browser.tabs.create({ url: extensionData.homePageLink })} sx={{ color: 'white', padding: '0px' }}>Home</Button>
            </Box>
            <Box sx={{ padding: 2 }}>
                <Box sx={{ padding: '20px 0px' }}>
                    {extensionData.description}{" "}
                    <a href={extensionData.descriptionLink} target="_blank" rel="noreferrer">{extensionData.descriptionLinkTitle}</a>
                </Box>
                <Box>
                    {
                        extensionData?.groups ? extensionData?.groups.map((group: any, index: any) => {
                            return (
                                <Accordion key={index} expanded={opened == index} onChange={(e, expanded) => {
                                    if (expanded) setOpened(index)
                                    else setOpened(null)
                                }}>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}
                                    >
                                        <Box sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            width: '100%'
                                        }}>
                                            <Typography style={{ fontSize: '0.7rem' }}>{group.title}</Typography>
                                            <Typography sx={{ padding: '1px 5px', backgroundColor: 'cornflowerblue', color: 'white', borderRadius: '5px', fontSize: '0.6rem' }}>
                                                {group.checklists.filter((checklist: any) => !checklist.selected).length}
                                            </Typography>
                                        </Box>
                                    </AccordionSummary>

                                    <AccordionDetails>
                                        {
                                            (group?.youtubeEmbedId && group?.youtubeEmbedId !== "") ? <Box>
                                                <Box sx={{
                                                    display: "flex",
                                                    justifyContent: "center"
                                                }}>

                                                    <iframe width="420" height="315"
                                                        src={`https://www.youtube.com/embed/${group.youtubeEmbedId}`}>
                                                    </iframe>
                                                </Box>
                                                <Box sx={{ padding: '5px 10px', display: 'flex', justifyContent: "center", alignItems: 'center' }}>
                                                    <Button onClick={() => {
                                                        Browser.tabs.create({ url: `https://www.youtube.com/embed/${group.youtubeEmbedId}` })
                                                    }}> Watch On Youtube</Button>
                                                </Box>
                                            </Box> : null
                                        }
                                        <Box>
                                            {
                                                group.checklists.map((checklist: any, id: number) => {
                                                    return (<FormGroup key={id} sx={[{
                                                        "& .MuiTypography-root": {
                                                            fontSize: '0.8rem'
                                                        }
                                                    }]}>
                                                        <FormControlLabel
                                                            control={<Checkbox checked={checklist.selected} />}
                                                            label={checklist.description}
                                                            onClick={() => checkboxHandle(checklist.checklistId, checklist.selected)}
                                                            sx={[{
                                                                "& .MuiTypography-root": {
                                                                    fontSize: '0.8rem'
                                                                }
                                                            }]} />
                                                        {
                                                            checklist?.points ? <ul>
                                                                {
                                                                    checklist.points.map((point: any, id: number) => {
                                                                        return (<li key={id} style={{ fontSize: '0.7rem' }}>{point?.url ? <a href={point.url} target="_blank" rel="noreferrer">{point.title}</a> : point.title}</li>)
                                                                    })
                                                                }
                                                            </ul> : null
                                                        }
                                                    </FormGroup>)
                                                })
                                            }
                                        </Box>
                                    </AccordionDetails>
                                </Accordion>
                            )
                        }) : null
                    }

                </Box>
            </Box>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                backgroundColor: '#8fc3bd',
                color: 'white',
                padding: '0px 15px',
                marginTop: '20px',
                position: 'sticky',
                bottom: 0,
            }}>
                <LinearProgressWithLabel value={progress} />
                <Button startIcon={<RestartAlt />} onClick={async () => {
                    await setLocalStorage([])
                    initData()
                }}
                    sx={{ color: 'white' }}>
                    Reset
                </Button>
            </Box>
        </Box >
    )
}

export default Popup





function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', width: "-webkit-fill-available" }}>
            <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress variant="determinate" {...props} sx={[{
                    color: 'white',
                    "& .colorPrimary": {
                        color: 'white'
                    }, "& .colorSecondary": {
                        color: 'white'
                    }
                }]} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
                <Typography variant="body2" sx={[{
                    color: 'white',
                }]}>{`${Math.round(
                    props.value,
                )}%`}</Typography>
            </Box>
        </Box>
    );
}