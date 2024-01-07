import {
  getLocalStorage,
  setLocalStorage,
  updateData,
  runTimeMessage
} from './browserMethods'
import { MESSAGING } from './constants'

const changeStatus = async (status: string) => {
  await updateData({ status: status })
}

const addData = async (dataItem: any) => {
  const localData = await getLocalStorage()
  const updatedData = { ...localData, data: [...localData.data, dataItem] }
  await setLocalStorage(updatedData)
}

const refreshPopupData = async () => await runTimeMessage({ message: MESSAGING.FETCH_REFRESH_DATA })

export {
  addData,
  changeStatus,
  refreshPopupData
}

