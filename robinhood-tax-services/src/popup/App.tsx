import { Box, Typography } from '@mui/material';
import { blogData, logoUrl } from './const';
import Browser from 'webextension-polyfill';

const BlogItem = ({ data }: any) => {
    const blogClickHandle = () => {
        Browser.tabs.create({ url: data.url })
    }

    return <Box className="blog-item" onClick={blogClickHandle}>
        <Typography variant='h6' fontWeight={'bold'} fontSize={'13px'}>{data.title}</Typography>
        <Box className='blog-info'>
            <img src={data.thumbnail} alt="" />
            <Box>
                {data.description.map((el: any, key: any) => <Typography key={key} fontSize={'10px'}>{el}</Typography>)}
            </Box>
        </Box>

    </Box >
}

const App = () => {
    return (
        <Box>
            <Header />
            <Box className="main-continer">
                <img src={logoUrl} alt="" className='app-logo' />
                <Box className="blog-container">
                    {
                        blogData.map((item, key): any => <BlogItem data={item} key={key} />)
                    }
                </Box>
            </Box>
            <Footer />
        </Box>
    );
};

export default App;


const Header = () => <Box
    sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(73, 127, 32, 1)',
        color: 'black',
        padding: '5px 15px',
        top: 0,
        zIndex: 1000,
        height: "20px"
    }}
>
</Box>

const Footer = () => <Box sx={{
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(73, 127, 32, 1)',
    color: 'white',
    padding: '0px 15px',
    height: '30px'
}}>
</Box>