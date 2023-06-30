import { getLocalStorage, getSyncStorage, setLocalStorage, setSyncStorage } from './browerMethods'
import { initData } from './constants'

const initializeDataBase = async (pagesToScrap: number) => {
  const initialData = { ...initData, scraping: true }
  await setLocalStorage(initialData)
  await updatePageToScrap(pagesToScrap)
}

const updateProfiles = async (profiles: any) => {
  const localData = await getLocalStorage()
  const updatedData = { ...localData, profiles: [...localData.profiles, ...profiles] }

  await setLocalStorage(updatedData)
}

const updateAProfile = async (profileUrl: any, data: any) => {
  const localData = await getLocalStorage()
  const updatedProfiles = localData.profiles.map((profile: any) => {
    if (profile.profileUrl == profileUrl) {
      return {
        profileUrl,
        ...data,
      }
    } else return data
  })
  const updatedData = {
    ...localData,
    profiles: updatedProfiles,
  }
  await setLocalStorage(updatedData)
}

const getAllProfiles = async () => {
  const localData = await getLocalStorage()
  return localData.profiles
}

const updatePageToScrap = async (pagesToScrap: number) => {
  await setSyncStorage({
    pagesToScrap,
  })
}
const getPagesToScrap = async () => {
  const syncData = await getSyncStorage()
  return syncData.pagesToScrap
}

export {
  initializeDataBase,
  updateProfiles,
  updatePageToScrap,
  getPagesToScrap,
  getAllProfiles,
  updateAProfile,
}
