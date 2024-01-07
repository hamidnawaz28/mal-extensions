import Browser from 'webextension-polyfill'
import { setLocalStorage, tabMesage, waitForActiveTabLoads } from '../common/browserMethods'
import { MESSAGING, SCRAPING_STATUS } from '../common/constants'

Browser.runtime.onInstalled.addListener(async () => {
  await setLocalStorage({ status: SCRAPING_STATUS.IDLE, data: [], totalRows: 0, totalPages: 0, currentPage: 0 })
})

Browser.runtime.onMessage.addListener(async (request: any) => {
  const { message } = request
  if (message == MESSAGING.WAIT_FOR_ACTIVE_TAB_LOADS) {
    await waitForActiveTabLoads()
  }
  if (message == MESSAGING.INVOKE_DATA_COLLECTION) {
    await tabMesage({ message: MESSAGING.START_DATA_COLLECTION })
  }
  if (message == MESSAGING.INVOKE_PAGE_REFRESH) {
    tabMesage({ message: MESSAGING.REFRESH_PAGE_DATA })
  }
  return
})
