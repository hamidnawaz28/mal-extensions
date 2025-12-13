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

  const orderNumberIndex = getNodeIndex(findElementWithText('thead tr th', 'Bestellnummer'))
  const trackingNumberIndex = getNodeIndex(findElementWithText('thead tr th', 'Sendungsnummer'))

  const getSyncTrackingButton = document.querySelector('#sync-tracking-number')
  if (getSyncTrackingButton) return

  const syncTrackingButton = buttonInstance('Sync Trackings', 'sync-tracking-number', {
    marginLeft: '0px',
  })
  const syncTrackingTableRef = document.querySelector('table#t')
  syncTrackingTableRef.prepend(syncTrackingButton)

  syncTrackingButton.addEventListener('click', async () => {
    const dataRows = Array.from(document.querySelectorAll('tbody tr.selected'))
    let trackingData = []
    if (dataRows.length == 0) {
      alert('Select at least one row')
      return
    }
    for (let dataRowIndex = 0; dataRowIndex < dataRows.length; dataRowIndex++) {
      const dataCells = dataRows[dataRowIndex].querySelectorAll('td')
      const orderIdRef = dataCells[orderNumberIndex]
      const trackingNumberRef = dataCells[trackingNumberIndex]

      trackingData.push({
        orderId: orderIdRef.innerText,
        trackingNumber: trackingNumberRef.innerText,
      })
    }
    console.log('-------trackingData-----', trackingData)
    await Browser.runtime.sendMessage({
      action: SYNC_TRACKING_NUMBER.INJECT_SYNC_TRACKING_NUMBER_SCRIPT,
      trackingData,
      // trackingData: [
      //   {
      //     orderId: 'PO-076-01412725212791674',
      //     trackingNumber: '12345',
      //   },
      // ],
    })
  })
}

const keepAliveSyncTracking = () => {
  setInterval(syncTrackingNumber, 1000)
}

keepAliveSyncTracking()
