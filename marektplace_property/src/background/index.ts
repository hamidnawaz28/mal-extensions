import Browser from 'webextension-polyfill'
import { setLocalStorage, updateLocalData } from '../common/apis'
import { getLocalStorage, runTimeMessage, tabMesage, waitForActiveTabLoads } from '../common/browerMethods'
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
      const excelFileName = `rental-data-${Date.now()}`
      return await createSheet(excelFileName)
    },
    [MESSAGING.UPDATE_EXCEL_SHEET_DATA]: async () => {
      await updateSheetData(data.spreadsheetId, [data.row])
    },
    [MESSAGING.SAVE_IMAGE]: async () => {
      return await uploadImage(data.folderid, data.imageIndex, data.imageUrl)
    },
    [MESSAGING.CREATE_FOLDER]: async () => {
      const ls = await getLocalStorage()
      const parents = !!ls.parentFolderId ? [ls.parentFolderId] : []
      return await createDriveFolder(data.folderName, parents)
    },
    [MESSAGING.WAIT_FOR_ACTIVE_TAB_LOADS]: async () => {
      await waitForActiveTabLoads()
    },
  }
  const response = await responseObj[message]()
  return response
})

Browser.runtime.onInstalled.addListener(async () => {
  const parentFolderName = `rental-${Date.now()}`
  const folderid = await await createDriveFolder(parentFolderName, [])
  await updateLocalData({ parentFolderId: folderid })
  INITITAL_DATA.parentFolderId = folderid
  await setLocalStorage(INITITAL_DATA)
})
