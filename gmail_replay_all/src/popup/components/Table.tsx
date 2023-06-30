import { Box, TablePagination } from '@mui/material'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { useEffect, useState } from 'react'
import { DeleteIconButton, EditIconButton } from './Buttons'

const allComponents = (name: string, data: any, onEditClick: any, onDeleteClick: any) => {
    if (name == 'edit') {
        return <EditIconButton onClick={() => onEditClick(data)} />
    }
    if (name == 'delete') {
        return <DeleteIconButton onClick={() => onDeleteClick(data)} />
    }
}
const getCellData = (header: any, row: any, onEditClick: any, onDeleteClick: any) => {
    if (header.type == 'value') {
        return header?.valMap ? header.valMap(row[header.value]) : row[header.value]
    }
    if (header.type == 'component') {
        return allComponents(header.component, row, onEditClick, onDeleteClick)
    }
}
function DataTableRef({ headers, data, onEditClick, onDeleteClick }: any) {
    const display = true
    return display ? (
        <TableContainer component={Paper}>
            <Table sx={{ width: '100%' }}>
                <TableHead>
                    <TableRow>
                        {headers.map((el: any, id: number) => {
                            return (
                                <TableCell align="center" key={id}>
                                    {el.label}
                                </TableCell>
                            )
                        })}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row: any, id: number) => (
                        <TableRow key={id}>
                            {headers.map((header: any, key: number) => {
                                return (
                                    <TableCell align="center" key={key}>
                                        {row[header.value]}
                                    </TableCell>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    ) : null
}

const DataTable = ({ headers, data, onEditClick, onDeleteClick }: any) => {
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const [filteredData, setFilteredData] = useState([])

    const handleChangePage = (e: any, value: any) => {
        setPage(Number(value))
    }

    const handleChangeRowsPerPage = (e: any) => {
        setRowsPerPage(Number(e.target.value))
    }

    useEffect(() => {
        setPage(0)
    }, [rowsPerPage])

    useEffect(() => {
        const filteredData = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        setFilteredData(filteredData)
    }, [page, rowsPerPage])

    return (
        <Box>
            <DataTableRef
                headers={headers}
                data={filteredData}
                onEditClick={onEditClick}
                onDeleteClick={onDeleteClick}
            />
            <TablePagination
                component="div"
                count={data.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[3, 5, 25, 100, 500]}
            />
        </Box>
    )
}
export default DataTable
