import Browser from 'webextension-polyfill'
import { MESSAGING } from './constants'
import { asyncSleep } from './utils'

const STORE_NAME = 'marketplace_property'

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

async function setBlobStorage(imageBlog: any) {
  await localRef.set({ imageBlog: imageBlog })
}

async function getBlogStorage() {
  const data = await localRef.get()
  return data['imageBlog']
}

async function tabMesage(data: any) {
  const tabsData: any = await Browser.tabs.query({ active: true })
  return await Browser.tabs.sendMessage(tabsData[0].id, { ...data })
}

async function runTimeMessage(data: any) {
  return await Browser.runtime.sendMessage(data)
}

async function updateCurrentPageUrl(url: string) {
  if (!url) return
  const tabsData: any = await Browser.tabs.query({ active: true })
  Browser.tabs.update(tabsData[0].id, { url: url })
}

async function updateActiveTabUrl(url: string) {
  const tabsData: any = await Browser.tabs.query({
    active: true,
  })

  await Browser.tabs.update(tabsData[0]?.id, { url })
  await waitTillTabLoads(tabsData[0]?.id)
}

async function activeTabData() {
  const tabsData: any = await Browser.tabs.query({
    active: true,
  })
  return await tabsData[0]
}

async function waitForActiveTabLoads() {
  const tabsData: any = await Browser.tabs.query({
    active: true,
  })
  return await waitTillTabLoads(tabsData[0]?.id)
}

async function waitForActiveTabLoadsRunTime() {
  await runTimeMessage({
    message: MESSAGING.WAIT_FOR_ACTIVE_TAB_LOADS,
  })
}

async function waitTillTabLoads(tabId: number) {
  await asyncSleep(0.5)
  const tab = await Browser.tabs.get(tabId)

  if (tab.status == 'loading') {
    await waitTillTabLoads(tabId)
  } else return tabId
}




export {
  setSyncStorage,
  getSyncStorage,
  setLocalStorage,
  getLocalStorage,
  tabMesage,
  runTimeMessage,
  setBlobStorage,
  getBlogStorage,
  updateCurrentPageUrl,
  updateActiveTabUrl,
  waitForActiveTabLoads,
  asyncSleep,
  activeTabData,
  waitForActiveTabLoadsRunTime
}
