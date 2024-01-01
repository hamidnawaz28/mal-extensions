import { Box, Button, Typography } from '@mui/material'
import Popup from './Popup'
import { LocationOn, AttachMoney, LocalHotel, Bathtub, Straighten } from '@mui/icons-material'
const AppOr = () => {
  return <Popup />
}

const App = () => {
  const reviewData = {
    "id": 301,
    "date": "1/31/2022 ",
    "reviewer_name": "rsalsawins",
    "local_knowledge": "5.00",
    "process_expertise": "5.00",
    "responsiveness": "5.00",
    "negotiation_skills": "5.00",
    "total_score": "5.00",
    "headline": "Sold a Single Family home in 2021 in Wilmington, DE.",
    "body": "Working with Kristin was a seamless pleasure! She sold a second home of ours in a timely manner and we were very happy with the price outcome. Kristen was extremely professional constantly keeping us up to speed as the process proceeded. I highly recommend Kristen for all your real estate needs."
  }
  const listingData = {
    "id": 342,
    "image": "https://photos.zillowstatic.com/fp/d6eaa7ffd5d85136c25594e5ebcae848-cc_ft_960.jpg",
    "price": 150000,
    "address": "3704 Pevetoe St Austin TX 78725",
    "bedrooms": "3.00",
    "baths": "2.00",
    "sq_ft": 1511,
    "seller_phone_number": " (469) 223-2564",
    "zillow_listing_url": "https://www.zillow.com/homedetails/3704-Pevetoe-St-Austin-TX-78725/29462509_zpid/"
  }
  return <Box sx={{
    width: '500px',
    borderRadius: "10px",
    border: '2px solid black'
  }}>
    <Box>
      <ListingCard data={listingData} />
    </Box>
    <Box>
      <ReviewsCard data={reviewData} />
    </Box>
  </Box>
}

const ListingCard = ({ data }: any) => {
  const id = data?.id
  const image = data?.image
  const price = data?.price
  const address = data?.address
  const bedrooms = data?.bedrooms
  const baths = data?.baths
  const sq_ft = data?.sq_ft
  const seller_phone_number = data?.seller_phone_number
  const zillow_listing_url = data?.zillow_listing_url

  return <Box sx={{
    display: 'grid',
    gridTemplateColumns: "60% 40%",
    borderRadius: "10px",
  }}>
    <Box >
      <img src={image} style={{
        borderRadius: "10px",
        width: "100%",
      }} alt="" loading='lazy' />
    </Box>
    <Box>
      <Box >
        <Box sx={{
          display: "grid",
          gridTemplateColumns: "50% 50%"
        }}>
          <IconText text={price} icon={<AttachMoney />} />
          <IconText text={parseInt(bedrooms)} icon={<LocalHotel />} />
          <IconText text={parseInt(baths)} icon={<Bathtub />} />
          <IconText text={sq_ft} icon={<Straighten />} />
        </Box>
        <IconText text={address} icon={<LocationOn />} />
        <IconText text={seller_phone_number} icon={<LocationOn />} />
      </Box>
      <Box sx={{
        width: '100%',
        display: "flex",
        justifyContent: 'end',
      }
      }>
        <Button variant='contained' size='small' color='error' sx={{
          m: "15px"
        }}>
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

  }}>
    <Box>
      <Typography variant='subtitle1' fontWeight={'bold'}>
        {headline}
      </Typography>
      <Box sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
      }}>
        <Typography>
          {reviewer_name}
        </Typography>
        <Typography>
          {date}
        </Typography>
      </Box>
      <Typography variant='body2'>
        {body}
      </Typography>
    </Box>
    <Box sx={{
      padding: '10px'
    }}>
      <Box sx={{
        display: 'flex',
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <Typography>
          {total_score}
        </Typography>
        <Typography>
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
    <Typography>
      {text}
    </Typography>
    <Typography>
      {number}
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
      p: '5px',
      color: '#8c939d'
    }}>
      {icon}
    </Box>
    <Typography>
      {text}
    </Typography>
  </Box>
}

export default AppOr