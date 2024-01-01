import { Box, Button } from '@mui/material'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { apiFactory } from '../../common/apis'
import { runTimeMessage, waitForActiveTabLoadsRunTime } from '../../common/browerMethods'
import { MESSAGING } from '../../common/constants'

const ButtonComponent = ({ text, onClickHandle }: any) => {
    return <Button sx={{
        color: 'white',
        width: '100%',
        padding: '3px',
        backgroundColor: '#e78e18',
        border: 'none',
        borderRadius: '4px',
        zIndex: "1000",
        '&:hover': {
            cursor: "pointer",
            color: 'black',
        }
    }}
        onClick={onClickHandle}
    >
        {text}
    </Button>
}


const Buttons = () => {
    const marketplaceClickHandle = () => { runTimeMessage({ message: MESSAGING.INVOKE_MARKEPLACE_LIST_PROCESS }) }
    const pageClickHandle = () => { runTimeMessage({ message: MESSAGING.INVOKE_PAGE_LIST_PROCESS }) }

    return <Box style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gridGap: '40px',
        paddingTop: '20px'
    }}>
        <ButtonComponent text='Post to marketplace' onClickHandle={marketplaceClickHandle} />
        <ButtonComponent text='Post to FB page' onClickHandle={pageClickHandle} />
    </Box>
}

const ReviewButton = ({ data }: any) => {
    const reviewButtonClickHandle = async () => {
        await apiFactory.saveReview(data)
    }

    return <Box style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gridGap: '40px',
        paddingTop: '20px'
    }}>
        <ButtonComponent text='Collect Review' onClickHandle={reviewButtonClickHandle} />
    </Box>
}
window.addEventListener('locationchange', function () {
    console.log('location changed!');
}); ddd
const embedUi = async () => {
    const listingData = await apiFactory.getReviews()
    await waitForActiveTabLoadsRunTime()
    setInterval(async () => {
        const fbsoUi = document.querySelector("#fbso-ui") as HTMLElement
        const statusRef = document.querySelector("[class*='HomeStatusIconAndText__StyledStatusText']") as HTMLElement
        const ownerIsSeller = statusRef?.innerText == 'For sale by owner' || statusRef?.innerText == 'Auction'

        const selectedElement = document.querySelector("[data-testid='home-details-chip-container']") as HTMLElement
        if (!fbsoUi && selectedElement && listingData?.success && ownerIsSeller) {
            const rootElement = document.createElement("div")
            rootElement.id = 'fbso-ui'
            selectedElement?.append(rootElement)
            const root = ReactDOM.createRoot(rootElement)
            root.render(
                <React.StrictMode>
                    <Buttons />
                </React.StrictMode>
            )
        }
    }, 2000)

    setInterval(async () => {
        const reviewList = Array.from(document.querySelectorAll("#reviews [class*='StyledLoadingMaskContent'] ul li")) as HTMLElement[]

        if (reviewList.length == 0 && !listingData?.success) {
            return
        }
        for (const review of reviewList) {
            const overallRef = review.querySelector('div:nth-child(1) [class*="StyledNumberRating"] span') as HTMLElement
            const overallRating = overallRef.innerText

            const textRef = review.querySelector('p') as HTMLElement
            const date = textRef?.innerText?.split('\n')?.[0]?.split(" - ")?.[0]
            const reviewer = textRef?.innerText?.split('\n')?.[0]?.split(" - ")?.[1]
            const headline = textRef?.innerText?.split('\n')?.[1]

            const reviewsRef = Array.from(review.querySelectorAll('div:nth-child(3)[class*="Spacer"] div>span>span[role="img"]')) as HTMLElement[]
            const allReviews = reviewsRef.map((review) => review?.getAttribute('aria-label')?.split(" out of 5 stars")?.[0])
            const localKnowledgeReview = allReviews[0]
            const processExpertiseReview = allReviews[0]
            const responsivenessReview = allReviews[0]
            const negotiationSkillsReview = allReviews[0]

            const bodyRef = review.querySelector('div:nth-child(4)[class*="Spacer"] > div[class*="Text"]') as HTMLElement
            const body = bodyRef?.innerText ?? ''

            const data = {
                total_score: overallRating,
                reviewer_name: reviewer,
                headline,
                date,
                local_knowledge: localKnowledgeReview,
                process_expertise: processExpertiseReview,
                responsiveness: responsivenessReview,
                negotiation_skills: negotiationSkillsReview,
                body
            }

            const rootElement = document.createElement("div")
            rootElement.className = 'review-collector-ui'
            const reviewButtonRef = review.querySelector('.review-collector-ui') as HTMLElement
            if (reviewButtonRef) return
            review?.append(rootElement)
            const root = ReactDOM.createRoot(rootElement)
            root.render(
                <React.StrictMode>
                    <ReviewButton data={data} />
                </React.StrictMode>
            )
        }
    }, 2000)
}

embedUi()