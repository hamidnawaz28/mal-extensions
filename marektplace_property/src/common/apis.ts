import { getLocalStorage, getSyncStorage, setLocalStorage, setSyncStorage } from './browerMethods'

const updateLocalData = async (data: any) => {
  const localData = await getLocalStorage()

  const updatedData = {
    ...localData,
    ...data,
  }
  await setLocalStorage(updatedData)
}

export { updateLocalData, getSyncStorage, setSyncStorage, getLocalStorage, setLocalStorage }
