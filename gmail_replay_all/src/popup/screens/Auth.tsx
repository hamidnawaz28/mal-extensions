import { Button, Box } from '@mui/material';

const Auth = () => {
    return (
        <Box sx={{ display: 'grid', gridGap: 20 }}>
            <Button variant="contained" color="primary">
                Sign In
            </Button>
            <Button variant="outlined" color="primary">
                Sign Up
            </Button>
        </Box>
    );
};

export default Auth;