// import Browser from 'webextension-polyfill';
import { getLocalStorage, updateAdData, updateProcessingStatus } from '../common/browserMethods'
// Browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.action === 'getAds') {
//     const ads = extractAdData();
//     sendResponse({ success: true, ads });
//   }
//   return true;
// });

const shouldStop = async (stopProcess) => {
  let getLocalStorageData = await getLocalStorage()
  if (!getLocalStorageData.isProcessing) {
    stopProcess()
    return true
  }
  return false
}

export async function extractAdData(setProgress, stopProcess) {
  const ads = []
  setProgress(0)
  await autoScrollToBottom(stopProcess)
  const adElements = document.querySelectorAll("[aria-haspopup='menu']")
  for (const [index, adElement] of adElements.entries()) {
    try {
      const adGrid = adElement.parentElement.parentElement.parentElement.parentElement
      const libraryIdElement = getLibraryIdFromAd(adGrid)
      let getLocalStorageData = await getLocalStorage()
      const existingAd =
        getLocalStorageData.data.find((ad) => ad.libraryId === libraryIdElement) ?? false
      if (existingAd) {
        console.log('Ad already exists in storage, skipping:', libraryIdElement)
        continue
      }
      const multipleAds = checkForMultipleAds(adGrid)

      if (multipleAds) {
        console.log('Ad multiple ads:', libraryIdElement)
        continue
      }

      if (await shouldStop(stopProcess)) return
      clickDetailsButton(adGrid)
      const getDialogRef = () =>
        document.querySelector("[data-visualcompletion] div[role='dialog']")

      await waitForElement(getDialogRef)

      if (await shouldStop(stopProcess)) return
      await waitTill(2000)
      const dialogRef = getDialogRef()
      clickTransparencyButton(dialogRef)
      if (await shouldStop(stopProcess)) return
      await waitTill(2000)
      const totalReach = await getTotalReach(dialogRef, stopProcess)
      const totalDays = getDaysCount(dialogRef)
      const libraryId = getLibraryId(dialogRef)

      const data = {
        id: index,
        libraryId,
        reach: totalReach,
        totalDays,
      }
      console.log(data)
      await updateAdData([data])
      ads.push(data)
      const percent = Math.round(((index + 1) / adElements.length) * 100)
      setProgress(percent)
      await closeDialog(dialogRef)
      await waitTill(2000)
      addReachAndDaysButtons(adGrid, totalReach, totalDays)
    } catch (err) {
      const dialogRef = getDialogRef()
      await closeDialog(dialogRef)
      if (await shouldStop(stopProcess)) return
      await waitTill(2000)
      console.log(err)
    }
  }
  await updateProcessingStatus(false)
  stopProcess()
}

const findElementContainingText = (ref, element, text) => {
  return [...ref.querySelectorAll(element)].find((span) => span.textContent.includes(text))
}
const getLibraryIdFromAd = (adRef) => {
  return findElementContainingText(adRef, 'span', 'Library ID: ')?.innerText?.replace(
    'Library ID: ',
    '',
  )
}
const countDays = (dateStr) => {
  const targetDate = new Date(dateStr)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const diffMs = targetDate - today
  return Math.abs(Math.round(diffMs / (1000 * 60 * 60 * 24)))
}
const getDialogRef = () => document.querySelector("[data-visualcompletion] div[role='dialog']")

const checkForMultipleAds = (gridRef) => {
  return findElementContainingText(gridRef, 'span', ' use this creative and text')
}

async function closeDialog(dialogRef, timeout = 5000) {
  // Click the close button
  const closeButton = findElementContainingText(dialogRef, 'div[role="button"]', 'Close')
  if (closeButton) {
    closeButton.click()
  }

  // Keep checking until the dialog disappears
  const start = Date.now()
  return new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      const stillOpen = document.body.contains(dialogRef)

      if (!stillOpen) {
        clearInterval(interval)
        resolve('Dialog closed')
      }

      if (Date.now() - start > timeout) {
        clearInterval(interval)
        reject()
      }
    }, 300)
  })
}

const clickDetailsButton = (gridRef) => {
  const detailsButton = findElementContainingText(gridRef, 'div[role="button"]', 'See ad details')
  detailsButton.click()
}

const clickTransparencyButton = (dialogRef) => {
  const transparencyButton = findElementContainingText(
    dialogRef,
    'div[role="heading"]',
    'Transparency by location',
  )
  transparencyButton.click()
}

const getDaysCount = (dialogRef) => {
  const adDateReach = findElementContainingText(dialogRef, 'span', 'Started running on')
  const adDate = adDateReach?.innerText?.match(
    /(?:[A-Za-z]{3} \d{1,2},? \d{4}|\d{1,2} [A-Za-z]{3} \d{4})/,
  )?.[0]
  return countDays(adDate)
}

const getLibraryId = (dialogRef) => {
  const adIdReach = findElementContainingText(dialogRef, 'span', 'Library ID: ')
  return adIdReach.innerText.replace('Library ID: ', '')
}

const getTotalReach = async (dialogRef, stopProcess) => {
  let totalReachEu = 0
  let totalReachUk = 0
  try {
    const euDetailsButton = findElementContainingText(
      dialogRef,
      '[role="tablist"] div',
      'European Union',
    )
    if (euDetailsButton) {
      euDetailsButton?.click()
      if (await shouldStop(stopProcess)) return
      await waitTill(2500)
      const euDeliveryReach = findElementContainingText(
        dialogRef,
        'div[role="heading"]',
        'EU ad delivery',
      )
      const totalReachEuRef = euDeliveryReach.nextElementSibling
        .querySelector(':nth-child(2)')
        .innerText.replaceAll(',', '')
      totalReachEu = totalReachEuRef ? Number(totalReachEuRef) : 0
    }
  } catch (error) {
    console.error('Error fetching EU ad delivery data:', error)
  }

  try {
    const ukDetailsButton = findElementContainingText(
      dialogRef,
      '[role="tablist"] div',
      'United Kingdom',
    )
    if (ukDetailsButton) {
      ukDetailsButton?.click()
      if (await shouldStop(stopProcess)) return
      await waitTill(2500)
      const ukDeliveryReach = findElementContainingText(
        dialogRef,
        'div[role="heading"]',
        'Ad delivery',
      )
      const totalReachUkRef = ukDeliveryReach.nextElementSibling
        .querySelector(':nth-child(2)')
        ?.innerText.replaceAll(',', '')
      totalReachUk = totalReachUkRef ? Number(totalReachUkRef) : 0
    }
  } catch (error) {
    console.error('Error fetching UK ad delivery data:', error)
  }
  return totalReachEu + totalReachUk
}

export const waitTill = async (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export async function waitForElement(mainGridSelector, maxRetries = 50, interval = 2000) {
  const retries = 0
  const foundElement = false

  while (foundElement === false && retries < maxRetries) {
    const mainDiv = await mainGridSelector()

    if (mainDiv) return mainDiv
    await new Promise((res) => setTimeout(res, interval))
  }
  throw new Error('Element not found: ')
}

const addReachAndDaysButtons = (adGrid, reach, days) => {
  const detailsBoxRef = findElementContainingText(adGrid, 'span', 'Library ID: ').parentElement
    .parentElement.parentElement.parentElement

  const buttonContainer = document.createElement('div')
  buttonContainer.style.display = 'flex'
  buttonContainer.style.gap = '8px'
  buttonContainer.style.marginTop = '8px'

  const reachButton = document.createElement('div')
  reachButton.textContent = `Reach: ${reach}`
  reachButton.style.padding = '4px 8px'
  reachButton.style.cursor = 'pointer'
  reachButton.style.backgroundColor = '#1976d2'
  reachButton.style.color = 'white'
  reachButton.style.fontSize = '14px'
  reachButton.id = 'ad-reach'

  const daysButton = document.createElement('div')
  daysButton.textContent = `Days: ${days}`
  daysButton.style.padding = '4px 8px'
  daysButton.style.cursor = 'pointer'
  daysButton.style.backgroundColor = '#1976d2'
  daysButton.style.color = 'white'
  daysButton.style.fontSize = '14px'
  daysButton.id = 'ad-days'

  buttonContainer.appendChild(reachButton)
  buttonContainer.appendChild(daysButton)

  detailsBoxRef.appendChild(buttonContainer)
}

export function sortAdsByReach() {
  const adGrid = document.querySelectorAll("[aria-haspopup='menu']")
  if (!adGrid) return

  const adCards = Array.from(
    Array.from(adGrid).map(
      (el) => el.parentElement.parentElement.parentElement.parentElement.parentElement,
    ),
  )

  const adsWithReach = adCards.map((card) => {
    const reachEl = findElementContainingText(card, '#ad-reach', 'Reach: ')
    let reach = -1
    if (reachEl) {
      reach = Number(reachEl.textContent.replace('Reach: ', ''))
    }
    return { card, reach }
  })

  adsWithReach.sort((a, b) => b.reach - a.reach)
  const pinchRef =
    document.querySelector("[aria-haspopup='menu']").parentElement.parentElement.parentElement
      .parentElement.parentElement.parentElement
  adsWithReach.forEach(({ card }) => pinchRef.appendChild(card))
}

const loadingSelector = () =>
  document.querySelector(
    "div[data-visualcompletion='loading-state']>span[aria-valuetext='Loading']>svg",
  )

async function autoScrollToBottom(stopProcess) {
  let lastSeen = Date.now()

  function isLoaderVisible() {
    return loadingSelector() !== null
  }

  return new Promise((resolve) => {
    const interval = setInterval(async () => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })

      if (isLoaderVisible()) {
        lastSeen = Date.now()
      }
      const shouldStopLoading = await shouldStop(stopProcess)
      const timeIsUp = Date.now() - lastSeen > 10000
      if (timeIsUp || shouldStopLoading) {
        clearInterval(interval)
        resolve('Scrolling finished, no loader detected for 10s')
      }
    }, 1500)
  })
}
