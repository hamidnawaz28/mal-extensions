import Browser from 'webextension-polyfill'

const STORE_NAME = 'youtube_checklist'

const syncRef = Browser.storage.sync
const localRef = Browser.storage.local

async function setSyncStorage(data: any) {
  await syncRef.set({ [STORE_NAME]: data })
}

async function getSyncStorage() {
  const data = await syncRef.get()
  return data[STORE_NAME]
}

async function setLocalStorage(data: any) {
  await localRef.set({ [STORE_NAME]: data })
}

async function getLocalStorage() {
  const data = await localRef.get()

  return data[STORE_NAME]
}

const addNumber = async (number: number) => {
  const checklist = await getLocalStorage()
  const newChecklist = [...checklist, number]
  await setLocalStorage(newChecklist)
}
const removeNumber = async (number: number) => {
  const checklist = await getLocalStorage()
  const newChecklist = checklist.filter((num: number) => num != number)
  await setLocalStorage(newChecklist)
}
export { setSyncStorage, getSyncStorage, setLocalStorage, getLocalStorage, addNumber, removeNumber }
