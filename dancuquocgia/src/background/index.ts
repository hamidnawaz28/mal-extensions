import Browser from 'webextension-polyfill'
import { getLocalStorage, setLocalStorage } from '../common/browerMethods'
import { INITITAL_DATA } from '../common/constants'

Browser.runtime.onMessage.addListener(async (request: any) => {
  const { message, number } = request

  const checklist = await getLocalStorage()
  // const responseObj = {
  //   [MESSAGING.ADD_NUMBER]: async () => {
  //     const newChecklist = [...checklist, number]
  //     await setLocalStorage(newChecklist)
  //   },

  // }
  // const response = await responseObj[message]()
  return true
})

Browser.runtime.onInstalled.addListener(async () => {
  await setLocalStorage(INITITAL_DATA)
})
