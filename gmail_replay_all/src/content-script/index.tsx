import { createRoot } from 'react-dom/client'
import '../../base.css'
import { Box } from '@mui/material'
import { asyncSleep } from '../common/utils'

const ResponseContainer = () => {
  const emailCollectorHandle = () => {
    const allUnreadEmails = Array.from(document.querySelectorAll('.UI tbody tr td[role="gridcell"]:nth-child(4) div:nth-child(2) span.bA4 > span.zF[email]')) as HTMLElement[]
    for (const emailRef of allUnreadEmails) {
      emailRef.click()

    }
    const indoxRef = document.querySelector('.aim [data-tooltip="Inbox"]')
    const emailDetailsRef = document.querySelector('[data-tooltip="Show details"]')
  }

  const composeQuickEmails = async () => {
    const inboxRef = document.querySelector('.aim [data-tooltip="Inbox"]') as HTMLElement
    inboxRef.click()
    await asyncSleep(3)
    let allEmails = Array.from(document.querySelectorAll('.UI tbody tr td[role="gridcell"]:nth-child(4) div:nth-child(2) span.bA4 > span.zF[email]')).map(el => el.getAttribute('email')) as string[]
    allEmails = Array.from(new Set(allEmails))
    const composeButton = document.querySelector('[role="navigation"] .aic [role="button"]') as HTMLElement
    composeButton.click()
    await asyncSleep(3)
    for (const email of allEmails) {
      document.execCommand("insertText", false, email);
      await asyncSleep(1)
      const emailList = document.querySelector('ul[peoplekit-id][role="listbox"] > div') as HTMLElement
      emailList.click()
    }
  }

  return <Box sx={[{
    paddingLeft: "48px",
    lineHeight: '20px'
  },
  {
    '&:hover': {
      cursor: 'pointer',
      backgroundColor: '#d7d5dd',
    }
  }

  ]}
    onClick={composeQuickEmails}>Replay All Emails (Amuda)</Box>
}

const renderReplyAll = () => {

  window.addEventListener('locationchange', function () {
    debugger
    renderReplyAll()
  });

  const timeInterval = setInterval(() => {
    const siteSelector = document.querySelector('[role="menu"]') as HTMLElement
    if (siteSelector !== null) {
      clearInterval(timeInterval)
      const responseContainer = document.createElement('div')
      siteSelector.append(responseContainer)
      const root = createRoot(responseContainer)
      root.render(<ResponseContainer />)
    }
  }, 1000)
}
window.addEventListener('locationchange', function () {
  debugger
  renderReplyAll()
});

renderReplyAll()


