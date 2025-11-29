import { SYNC_TRACKING_NUMBER } from '../../common/const'
import { browserRef } from '../../common/utils'

browserRef.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
  if (msg.action === SYNC_TRACKING_NUMBER.SYNC_TRACKING_NUMBER) {
    await syncTrackingNumber(msg.trackingData)
    sendResponse({})
  }
  return true
})

const syncTrackingNumber = async (data) => {
  console.log('---sync tracking number----')
}
