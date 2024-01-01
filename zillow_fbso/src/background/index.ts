import Browser from 'webextension-polyfill'
import { setBlobStorage, getLocalStorage, tabMesage, updateActiveTabUrl, activeTabData, setLocalStorage, updateData } from '../common/browerMethods'
import { INITITAL_DATA, MESSAGING, FB_MARKETPLACE_PROP_SALE_PAGE } from '../common/constants'
import { asyncSleep, getBlobFromImgUrl } from '../common/utils'
import { waitForActiveTabLoads } from '../common/browerMethods'

Browser.runtime.onMessage.addListener(async (request: any) => {
  const { message, data } = request

  const responseObj = {
    [MESSAGING.INVOKE_MARKEPLACE_LIST_PROCESS]: async () => {
      await asyncSleep(1)
      await tabMesage({ message: MESSAGING.COLLECT_ZILLOW_PROP_DATA })
      await asyncSleep(1)
      await updateActiveTabUrl(FB_MARKETPLACE_PROP_SALE_PAGE)
      await waitForActiveTabLoads()

      await asyncSleep(3)
      const data = await getLocalStorage()
      await tabMesage({ message: MESSAGING.UPLOAD_DATA_TO_FB_PROP_SALE_MARKETPLACE, prop: data.prop })
    },

    [MESSAGING.INVOKE_PAGE_LIST_PROCESS]: async () => {
      await asyncSleep(1)
      await tabMesage({ message: MESSAGING.COLLECT_ZILLOW_PROP_DATA })
      await asyncSleep(1)
      const data = await getLocalStorage()
      await updateActiveTabUrl(data.fbPageUrl)
      await waitForActiveTabLoads()

      await asyncSleep(3)

      await tabMesage({ message: MESSAGING.UPLOAD_TO_FB_PAGE, prop: data.prop })
    },

    [MESSAGING.SET_BLOB_FROM_URL]: async () => {
      const { imageUrl } = data
      const base64 = await getBlobFromImgUrl(imageUrl)
      await setBlobStorage(base64)
      return
    },

    [MESSAGING.WAIT_FOR_ACTIVE_TAB_LOADS]: async () => {
      await waitForActiveTabLoads()
    }
  }

  const response = await responseObj[message]()
  return response
})

Browser.runtime.onInstalled.addListener(async () => {
  await setLocalStorage(INITITAL_DATA)
})
