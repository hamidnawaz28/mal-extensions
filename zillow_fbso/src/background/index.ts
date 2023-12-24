import Browser from 'webextension-polyfill'
import { setLocalStorage, updateData, } from '../common/apis'
import { setBlobStorage, tabMesage, updateActiveTabUrl, activeTabData } from '../common/browerMethods'
import { INITITAL_DATA, MESSAGING, VECHICLE_PAGE, SITES_MAP, VehicleSiteTypes } from '../common/constants'
import { asyncSleep, getBlobFromImgUrl } from '../common/utils'
import { waitForActiveTabLoads } from '../common/browerMethods'

Browser.runtime.onMessage.addListener(async (request: any) => {
  const { message, data } = request

  const responseObj = {
    [MESSAGING.SET_BLOB_FROM_URL]: async () => {
      const { imageUrl } = data
      const base64 = await getBlobFromImgUrl(imageUrl)
      await setBlobStorage(base64)
      return
    },


    [MESSAGING.COLLECT_CAR_DATA]: async () => {

      const { url } = data
      const site: VehicleSiteTypes = data.site
      await updateActiveTabUrl(`${url}`)
      await asyncSleep(1)


      const activeTab = await activeTabData()
      await Browser.scripting.executeScript({
        target: { tabId: activeTab.id },
        files: [SITES_MAP[site].dataScript],
      })

      await asyncSleep(1)

      const vehicleData = await tabMesage({
        message: SITES_MAP[site].dataMessage
      })

      await updateActiveTabUrl(VECHICLE_PAGE)
      await asyncSleep(1)
      await tabMesage({ message: MESSAGING.UPLOAD_ITEM, vehicleData: vehicleData, site })

      await updateData({
        vehicleData: {},
      })
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
