import Browser from 'webextension-polyfill'
import { setLocalStorage } from '../common/apis'
import { tabMesage, waitForActiveTabLoads } from '../common/browerMethods'
import { INITITAL_DATA, MESSAGING } from '../common/constants'
import { createDriveFolder, createSheet, updateSheetData, uploadImage } from '../common/googleApis'

Browser.runtime.onMessage.addListener(async (request: any) => {
  const { message, data } = request

  const responseObj = {
    [MESSAGING.INVOKE_BATCH_DATA_COLLECTION]: async () => {
      await tabMesage({ message: MESSAGING.COLLECT_BATCH_PROPERTY_DATA })
    },
    [MESSAGING.INVOKE_SINGLE_DATA_COLLECTION]: async () => {
      await tabMesage({ message: MESSAGING.COLLECT_SINGLE_PROPERTY_DATA })
    },

    [MESSAGING.CREATE_EXCEL_FILE]: async () => {
      return await createSheet('Marketplace rental data')
    },
    [MESSAGING.UPDATE_EXCEL_SHEET_DATA]: async () => {
      await updateSheetData(data.spreadsheetId, [data.row])
    },
    [MESSAGING.SAVE_IMAGE]: async () => {
      return await uploadImage(data.folderid, data.imageIndex, data.imageUrl)
    },
    [MESSAGING.CREATE_FOLDER]: async () => {
      return await createDriveFolder(data.folderName, [])
    },
    [MESSAGING.WAIT_FOR_ACTIVE_TAB_LOADS]: async () => {
      await waitForActiveTabLoads()
    },
  }
  const response = await responseObj[message]()
  return response
})

Browser.runtime.onInstalled.addListener(async () => {
  await setLocalStorage(INITITAL_DATA)
})
