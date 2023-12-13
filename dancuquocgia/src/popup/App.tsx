import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import { Button, Box } from '@mui/material'
import { sendActiveTabMesage } from '../common/browerMethods';
import { MESSAGING } from '../common/constants';
import Papa from 'papaparse';

const App = () => {
    const [excelData, setExcelData] = useState<any>([]);
    const onDrop = (acceptedFiles: any) => {
        const file = acceptedFiles[0];
        const reader = new FileReader();

        // reader.onload = (e: any) => {
        //     const data = new Uint8Array(e.target.result);
        //     const workbook = XLSX.read(data, { type: 'array' });
        //     const sheetName = workbook.SheetNames[0];
        //     const excelData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        //     console.log(excelData, '---------data');

        //     setExcelData(excelData);
        // };

        // reader.readAsArrayBuffer(file);

        reader.onload = (e: any) => {
            const csvText = e.target.result;

            // Parse CSV using Papaparse
            Papa.parse(csvText, {
                complete: (result: any) => {
                    const csvData = result.data;
                    console.log(csvData, '---------data');
                    setExcelData(csvData);

                },
                header: true, // Assuming the CSV has a header row
            });
        };

        reader.readAsText(file);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    const onuploadHandler = () => {
        sendActiveTabMesage({ message: MESSAGING.ENTER_DATA, data: excelData })
    }
    return (
        <Box className="container">
            <Box className='heading'>
                Dancuquocgia Uploader
            </Box>
            <Box className="uploader">
                <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
                    <input {...getInputProps()} />
                    <p>Drag & drop scv here or click</p>
                    <p>Make sure to use same template</p>
                    <p>use (same date formats, same country names as website)</p>

                </div>
                {/* {excelData.length && (
                    <div>
                        <h2>Excel Data:</h2>
                        <pre>{JSON.stringify(excelData, null, 2)}</pre>
                    </div>
                )} */}
            </Box>
            <Box>
                Available Data: {excelData?.length}
            </Box>
            <Box>
                <Button onClick={onuploadHandler} variant='contained'>Upload</Button>
            </Box>
        </Box>
    );
};

export default App;
