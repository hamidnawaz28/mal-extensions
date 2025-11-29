import Browser from 'webextension-polyfill'
import { waitTillActiveTabLoadsBackground } from '../../common/browserMethods'
import { SYNC_TRACKING_NUMBER } from '../../common/const'
import { asyncSleep, buttonInstance, findElementWithText } from '../../common/utils'

const getTrackingDetails = async () => {
  const orderId = '234324'
  const trackingNumber = 'TRACK123456'
  return {
    orderId,
    trackingNumber,
  }
}
async function syncTrackingNumber() {
  await waitTillActiveTabLoadsBackground()
  await asyncSleep(1000)

  const btn = buttonInstance('Sync Tracking Number', 'sync-tracking-number')

  btn.addEventListener('click', async () => {
    await Browser.runtime.sendMessage({
      action: SYNC_TRACKING_NUMBER.INJECT_SYNC_TRACKING_NUMBER_SCRIPT,
      trackingData: await getTrackingDetails(),
    })
  })
  findElementWithText('div', 'Order details').appendChild(btn)
}

syncTrackingNumber()
