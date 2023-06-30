import Browser from 'webextension-polyfill'
import {
  getAllProfiles,
  getPagesToScrap,
  initializeDataBase,
  updatePageToScrap,
  updateProfiles,
} from '../common/apis'
import { MESSAGING } from '../common/constants'

Browser.runtime.onMessage.addListener(async (request, tabInfo) => {
  const { message, data } = request
  const { tab } = tabInfo
  const tabId = tab?.id || 0

  const responseObj = {
    [MESSAGING.INITIALIZE_DATA]: async () => await initializeDataBase(data.pagesToScrap),
    [MESSAGING.UPDATE_PROFILES]: async () => await updateProfiles(data.profiles),
    [MESSAGING.UPDATE_PAGES_TO_SCRAP]: async () => await updatePageToScrap(data.pagesToScrap),
    [MESSAGING.GET_ALL_PROFILES]: async () => await getAllProfiles(),
    [MESSAGING.GET_PAGES_TO_SCRAP]: async () => await getPagesToScrap(),
  }

  const response = await responseObj[message]()
  return response
})

Browser.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
  }
})
