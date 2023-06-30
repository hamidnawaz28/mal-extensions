


import { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, CircularProgress } from '@mui/material';

function ExportPage() {
    const [exporting, setExporting] = useState(false);
    const [results, setResults] = useState<any>(null);
    const [open, setOpen] = useState(false);

    function handleExportClick() {
        setExporting(true);

        // simulate an export that takes 10 seconds and generates results
        setTimeout(() => {
            setResults({
                profilesScanned: 100,
                emailsFound: 50,
                extractedFile: 'emails.csv',
            });
            setExporting(false);
            setOpen(true);
        }, 10000);
    }

    function handleClose() {
        setOpen(false);
    }

    return (
        <div>
            {exporting ? (
                <div>
                    <p>Emails are getting extracted, hold on a second!</p>
                    <CircularProgress />
                </div>
            ) : (
                <Button onClick={handleExportClick} variant="contained">
                    Start Export
                </Button>
            )}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Export Results</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        No. of profiles scanned: {results?.profilesScanned}<br />
                        Emails found: {results?.emailsFound}<br />
                        Extracted CSV file will be downloaded automatically, please check your downloads folder.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>OK</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default ExportPage;

