import Browser from 'webextension-polyfill'
import { SYNC_TRACKING_NUMBER } from '../../common/const'
import {
  asyncSleep,
  buttonInstance,
  findElementWithText,
  getNodeIndex,
  waitTillRefDisappear,
} from '../../common/utils'

async function syncTrackingNumber() {
  await asyncSleep(2000)
  await waitTillRefDisappear("#t_processing[style='display: block;']")
  await asyncSleep(3000)

  const dataRows = Array.from(document.querySelectorAll('tbody tr.even, tbody tr.odd'))

  const orderNumberIndex = getNodeIndex(findElementWithText('thead tr th', 'Bestellnummer'))
  const trackingNumberIndex = getNodeIndex(findElementWithText('thead tr th', 'Sendungsnummer'))
  const iconsIndex = getNodeIndex(findElementWithText('thead tr th', 'Pl.'))

  for (let dataRowIndex = 0; dataRowIndex < dataRows.length; dataRowIndex++) {
    const trackingButton = dataRows[dataRowIndex].querySelector('#sync-tracking-number')
    if (trackingButton) continue
    const btn = buttonInstance('Sync TN', 'sync-tracking-number')

    const dataCells = dataRows[dataRowIndex].querySelectorAll('td')
    const orderIdRef = dataCells[orderNumberIndex]
    const trackingNumberRef = dataCells[trackingNumberIndex]

    btn.addEventListener('click', async () => {
      await Browser.runtime.sendMessage({
        action: SYNC_TRACKING_NUMBER.INJECT_SYNC_TRACKING_NUMBER_SCRIPT,
        trackingData: {
          orderId: orderIdRef.innerText,
          trackingNumber: trackingNumberRef.innerText,
        },
        // trackingData: {
        //   orderId: 'PO-076-01412725212791674',
        //   trackingNumber: '12345',
        // },
      })
    })
    dataCells[iconsIndex].prepend(btn)
  }
}

const keepAliveSyncTracking = () => {
  setInterval(syncTrackingNumber, 1000)
}

keepAliveSyncTracking()
