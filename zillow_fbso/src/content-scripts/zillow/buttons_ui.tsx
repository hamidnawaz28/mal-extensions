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
const uiStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gridGap: '40px',
    paddingTop: '20px',
    paddingbottom: "5px"
}

const AgentButtons = () => {
    const marketplaceClickHandle = () => { runTimeMessage({ message: MESSAGING.INVOKE_MARKEPLACE_LIST_PROCESS }) }
    const pageClickHandle = () => { runTimeMessage({ message: MESSAGING.INVOKE_PAGE_LIST_PROCESS }) }

    return <Box style={uiStyle}>
        <ButtonComponent text='Post to marketplace' onClickHandle={marketplaceClickHandle} />
        <ButtonComponent text='Post to FB page' onClickHandle={pageClickHandle} />
    </Box>
}

const FSBOButtons = () => {
    const collectDataHandle = () => { runTimeMessage({ message: MESSAGING.INVOKE_FSBO_SCRAP_PROCESS }) }

    return <Box style={uiStyle}>
        <ButtonComponent text='Add listing to CRM' onClickHandle={collectDataHandle} />
    </Box>
}


const ReviewButton = () => {
    const reviewButtonClickHandle = async (e: any) => {
        const element = e.target.parentElement.parentElement.parentElement
        const data = getReviewsData(element)
        await apiFactory.saveReview(data)
    }
    return <Box style={uiStyle}>
        <ButtonComponent text='Add review to your website' onClickHandle={reviewButtonClickHandle} />
    </Box>
}
window.addEventListener('locationchange', function () {
    console.log('location changed!');
})

const embedUi = async () => {
    const userAuthenticated = await apiFactory.getReviews()
    await waitForActiveTabLoadsRunTime()

    setInterval(async () => {
        // for agent listers
        const agentUi = document.querySelector("#agent-lister-ui") as HTMLElement
        const agentRoot = document.querySelector("[data-testid='home-details-chip-container']") as HTMLElement

        const isAnAgentListing = document.querySelector('[data-testid="attribution-BROKER"]')
        if (!agentUi && agentRoot && !!isAnAgentListing && userAuthenticated?.success) {
            const rootElement = document.createElement("div")
            rootElement.id = 'agent-lister-ui'
            agentRoot?.prepend(rootElement)
            const root = ReactDOM.createRoot(rootElement)
            root.render(
                <React.StrictMode>
                    <AgentButtons />
                </React.StrictMode>
            )
        }

        // for fsbo scrapper
        const fsboUi = document.querySelector("#fsbo-collector-ui") as HTMLElement
        const fsboRoot = document.querySelector("[data-testid='home-details-chip-container']") as HTMLElement

        const statusRef = document.querySelector("[class*='HomeStatusIconAndText__StyledStatusText']") as HTMLElement
        const isOwnerListing = statusRef?.innerText == 'For sale by owner'

        if (!fsboUi && fsboRoot && isOwnerListing && userAuthenticated?.success) {
            const rootElement = document.createElement("div")
            rootElement.id = 'fsbo-collector-ui'
            fsboRoot?.prepend(rootElement)
            const root = ReactDOM.createRoot(rootElement)
            root.render(
                <React.StrictMode>
                    <FSBOButtons />
                </React.StrictMode>
            )
        }

        // for review scrapper
        const reviewList = Array.from(document.querySelectorAll("#reviews [class*='StyledLoadingMaskContent'] ul li")) as HTMLElement[]
        if (reviewList.length !== 0 && userAuthenticated?.success) {
            for (const review of reviewList) {

                const rootElement = document.createElement("div")
                rootElement.className = 'review-collector-ui'
                const reviewButtonRef = review.querySelector('.review-collector-ui') as HTMLElement
                if (reviewButtonRef) return
                review?.prepend(rootElement)
                const root = ReactDOM.createRoot(rootElement)
                root.render(
                    <React.StrictMode>
                        <ReviewButton />
                    </React.StrictMode>
                )
            }
        }

    }, 2000)
}

embedUi()


const getReviewsData = (reviewRef: HTMLElement) => {
    const overallRef = reviewRef.querySelector('div:nth-child(1) [class*="StyledNumberRating"] span') as HTMLElement
    const overallRating = overallRef.innerText

    const textRef = reviewRef.querySelector('p') as HTMLElement
    const date = textRef?.innerText?.split('\n')?.[0]?.split(" - ")?.[0]
    const reviewer = textRef?.innerText?.split('\n')?.[0]?.split(" - ")?.[1]
    const headline = textRef?.innerText?.split('\n')?.[1]

    const reviewsRef = Array.from(reviewRef.querySelectorAll('div:nth-child(4)[class*="Spacer"] div>span>span[role="img"]')) as HTMLElement[]
    const allReviews = reviewsRef.map((review) => review?.getAttribute('aria-label')?.split(" out of 5 stars")?.[0])
    const localKnowledgeReview = allReviews[0]
    const processExpertiseReview = allReviews[1]
    const responsivenessReview = allReviews[2]
    const negotiationSkillsReview = allReviews[3]

    const bodyRef = reviewRef.querySelector('div:nth-child(5)[class*="Spacer"] > div[class*="Text"]') as HTMLElement
    const body = bodyRef?.innerText ?? ''

    return {
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

}