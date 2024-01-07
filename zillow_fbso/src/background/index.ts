import Browser from 'webextension-polyfill'
import { setBlobStorage, getLocalStorage, tabMesage, updateActiveTabUrl, activeTabData, setLocalStorage, updateData } from '../common/browerMethods'
import { INITITAL_DATA, MESSAGING, FB_MARKETPLACE_PROP_SALE_PAGE } from '../common/constants'
import { asyncSleep, getBlobFromImgUrl } from '../common/utils'
import { waitForActiveTabLoads } from '../common/browerMethods'
import { apiFactory } from '../common/apis'

Browser.runtime.onMessage.addListener(async (request: any) => {

  const { message } = request

  const collectData = async (pageUrl: string) => {
    await asyncSleep(1)
    await tabMesage({ message: MESSAGING.COLLECT_AGENT_LISTING_DATA })
    await asyncSleep(1)
    await updateActiveTabUrl(pageUrl)
    await waitForActiveTabLoads()
    await asyncSleep(3)
    return await getLocalStorage()
  }
  const responseObj = {
    [MESSAGING.INVOKE_MARKEPLACE_LIST_PROCESS]: async () => {
      const data = await collectData(FB_MARKETPLACE_PROP_SALE_PAGE)
      await tabMesage({ message: MESSAGING.UPLOAD_DATA_TO_FB_PROP_SALE_MARKETPLACE, prop: data.prop })
    },
    [MESSAGING.INVOKE_PAGE_LIST_PROCESS]: async () => {
      const ls = await getLocalStorage()
      const data = await collectData(ls.fbPageUrl)
      await tabMesage({ message: MESSAGING.UPLOAD_TO_FB_PAGE, prop: data.prop })
    },
    [MESSAGING.INVOKE_FSBO_SCRAP_PROCESS]: async () => {
      await asyncSleep(1)
      await tabMesage({ message: MESSAGING.COLLECT_FSBO_LISTING_DATA })
      await asyncSleep(1)
    },
    [MESSAGING.SET_BLOB_FROM_URL]: async () => {
      const { imageUrl } = request.data
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
