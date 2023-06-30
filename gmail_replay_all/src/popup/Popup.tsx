import { Box } from '@mui/material'
import { ActionButton, Table } from './components'
import { useEffect, useState } from 'react'
import { Select, Input, TextArea } from './components'
import { csvJSON } from '../common/utils'
import axios from 'axios'
const Popup = () => {
    const [vechicles, setVechicles] = useState<any>([])
    const [headers, setHeaders] = useState<any>([])

    const [type, setType] = useState('auto')
    const [delay, setDelay] = useState(1)
    const [description, setDescription] = useState('Introducing the latest addition to our inventory: a sleek and stylish car that is sure to turn heads on the road! With its impressive performance capabilities and state-of-the-art features, this car is a must-have for any car enthusiast. The exterior boasts a modern design that exudes sophistication and class, with aerodynamic lines and bold accents that give it a distinctive look.The interior is just as impressive, with a spacious cabin that comfortably seats five and is equipped with the latest in technology and convenience features.')
    const [search, setSearch] = useState('')

    const runHandle = () => { }
    const stopHandle = () => { }
    const openFacebookHandle = () => { }

    const getData = async () => {
        const response = await axios.get('https://sag.gemquery.com/api/v1/get-csv-file?api_key=a6331ad79e87450de97550b922658a31')

        const json = csvJSON(response.data)
        const heads = Object.keys(json[0]).map(el => {
            return ({
                label: el,
                value: el
            })
        })
        setHeaders(heads || [])
        debugger
        setVechicles(json || [])

    }

    const botStyleOptions = [
        {
            label: 'Manual',
            value: 'manual'
        },
        {
            label: 'Auto',
            value: 'auto'
        },
    ]



    return (
        <Box sx={{ width: '600px' }}>
            <Box sx={{ display: 'flex', gridGap: 20 }}>
                <ActionButton label='Run' onClick={runHandle} sx={{ color: 'white', backgroundColor: 'green' }} />
                <ActionButton label='Stop' onClick={stopHandle} sx={{ color: 'white', backgroundColor: 'red' }} />
                <ActionButton label='Open Facebook' onClick={openFacebookHandle} sx={{ color: 'white', backgroundColor: 'blue' }} />
            </Box>
            <Box sx={{
                display: "flex",
                alignItems: "center"
            }}>
                <Select options={botStyleOptions} setValue={setType} value={type} />
                <Input value={delay} setValue={setDelay} label='Delay' />
                <Input value={description} setValue={setDescription} label='Listing Description' multiline
                    rows={4} sx={{ width: '100%' }} />
            </Box>
            <ActionButton label='Load Vechicles' onClick={getData} sx={{ color: 'white', backgroundColor: 'blue' }} />
            <Input value={search} setValue={setSearch} label='Search' />
            <Table
                headers={headers}
                data={vechicles}
                onEditClick={(data: any) => console.log(data)}
                onDeleteClick={(data: any) => console.log(data)}
            />
        </Box>
    )
}

export default Popup