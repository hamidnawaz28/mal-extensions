import { SYNC_TRACKING_NUMBER } from '../../common/const'
import {
  asyncSleep,
  browserRef,
  findElementWithIncludeText,
  findElementWithText,
  waitTillRefAppears,
  writeTextToRef,
} from '../../common/utils'

browserRef.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
  if (msg.action === SYNC_TRACKING_NUMBER.SYNC_TRACKING_NUMBER) {
    await syncTrackingNumber(msg.trackingData)
    sendResponse({})
  }
  return true
})

const syncTrackingNumber = async (trackingData) => {
  for (let trackingDataIndex = 0; trackingDataIndex < trackingData.length; trackingDataIndex) {
    const orderId = trackingData[trackingDataIndex].orderId
    const trackingNumber = trackingData[trackingDataIndex].trackingNumber

    const searchOrderRef = document.querySelector(
      '[placeholder="Suche bis zu 100 IDs gleichzeitig, getrennt durch Kommas."]',
    )
    searchOrderRef.value = ''
    await asyncSleep(1000)
    writeTextToRef(searchOrderRef, orderId)
    await asyncSleep(1000)
    searchOrderRef?.parentElement?.parentElement
      ?.querySelector('[class^=IPT_suffixWrapper]')
      ?.click()
    await asyncSleep(4000)
    const orders = findElementWithText(
      "div[role='button']",
      'Zurück zur Bestellliste',
    )?.parentElement?.parentElement?.querySelector('div:nth-child(2)')?.innerText

    if (orders?.toLowerCase() == '0 orders') {
      alert('Unable to found the order')
      return
    }
    findElementWithText('[data-testid="beast-core-ellipsis"]', 'confirm shipment').click()
    // when navigating directly trough order page
    // findElementWithText('div[role="button"]','confirm shipment').click()

    await waitTillRefAppears('[data-testid="beast-core-modal-inner"]', 'Confirm shipment')
    await asyncSleep(2000)
    const trackingNumberRef = findElementWithText(
      '[data-testid="beast-core-grid-col-wrapper"]',
      'Tracking number',
    ).parentElement.querySelector('input')
    writeTextToRef(trackingNumberRef, trackingNumber)

    const shippingMethodRef = findElementWithText(
      '[data-testid="beast-core-grid-col-wrapper"]',
      'Shipping method',
    ).parentElement.querySelector('input')
    writeTextToRef(shippingMethodRef, 'Hermes')

    findElementWithText(
      'ul[role=listbox] li[role][data-testid="beast-core-select-highlight"]',
      'Hermes',
    )?.click()
    const submitRef = findElementWithIncludeText(
      '[data-testid="beast-core-modal-inner"] [role="button"]',
      'submit',
    )
    submitRef.click()
    findElementWithIncludeText('[data-testid="beast-core-modal-inner"] span', 'confirm shipment')
      ?.parentElement?.querySelector('div')
      ?.click()
    await asyncSleep(2000)
    findElementWithIncludeText(
      '[data-testid="beast-core-modal-inner"] span',
      'exit',
    )?.parentElement?.click()
    await asyncSleep(2000)
  }
}
