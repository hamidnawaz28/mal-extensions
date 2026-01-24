/* eslint-disable no-undef */
import { waitTillActiveTabLoads } from '../common/browserMethods'
import { MESSAGING } from '../common/constants'
import { browserRef } from '../common/utils'

browserRef.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (msg.action === MESSAGING.WAIT_TILL_ACTIVE_TAB_LOADS) {
    await waitTillActiveTabLoads()
    sendResponse({})
  }
  return true
})
