import { getLocalStorage, getSyncStorage, setLocalStorage, setSyncStorage } from './browerMethods'

const updateData = async (data: any) => {
  const localData = await getLocalStorage()

  const updatedData = {
    ...localData,
    ...data,
  }
  await setLocalStorage(updatedData)
}

export { updateData, getSyncStorage, setSyncStorage, getLocalStorage, setLocalStorage }
