import Browser from 'webextension-polyfill'

const syncRef = Browser.storage.sync

const STORE_NAME = 'zillow_fbso'

async function setSyncStorage(data: UserDataInterface) {
  await syncRef.set({ [STORE_NAME]: data })
}

async function getSyncStorage() {
  const data = await syncRef.get()
  return data[STORE_NAME]
}

const getUserData = async () => {
  return await getSyncStorage()
}

const setUserData = async (data: UserDataInterface) => {
  await setSyncStorage(data)
}

interface UserDataInterface {
  premium: boolean
  signed: boolean
}

export { getUserData, setUserData, UserDataInterface }

// if user signed=>check if premium buyer,
