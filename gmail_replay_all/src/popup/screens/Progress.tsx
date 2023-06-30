import { useState } from 'react';
import { Button, CircularProgress } from '@mui/material';

function Progress() {
    const [exporting, setExporting] = useState(false);

    function handleExportClick() {
        setExporting(true);
        setTimeout(() => {
            setExporting(false);
        }, 10000);
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
        </div>
    );
}

export default Progress;