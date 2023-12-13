import Browser from 'webextension-polyfill'
import { asyncSleep } from './utils'

const syncRef = Browser.storage.sync
const localRef = Browser.storage.local

const STORE_NAME = 'contentcue'

async function setSyncStorage(data: any) {
  await syncRef.set({ [STORE_NAME]: data })
}

async function setLocalStorage(data: any) {
  await localRef.set({ [STORE_NAME]: data })
}

async function getSyncStorage() {
  const data = await syncRef.get()
  return data[STORE_NAME]
}

async function getLocalStorage() {
  const data = await localRef.get()
  return data[STORE_NAME]
}

async function updateLocalStorage(newData: any) {
  const localStorage = await getLocalStorage()
  const newStorage = {
    ...localStorage,
    ...newData,
  }
  await setLocalStorage(newStorage)
}

async function sendActiveTabMesage(data: any) {
  const activeTab = await activeTabData()
  return await Browser.tabs.sendMessage(activeTab.id, { ...data })
}

async function sendTabMesageWithId(tabId: number, data: any) {
  return await Browser.tabs.sendMessage(tabId, { ...data })
}

async function runTimeMessage(data: any) {
  return await Browser.runtime.sendMessage(data)
}

async function reloadATab(tabId: number) {
  await Browser.tabs.reload(tabId)
}

async function createATab(url: string) {
  return await Browser.tabs.create({ url })
}

async function updateATabUrl(tabId: number, url: string, wait = false) {
  await Browser.tabs.update(tabId, { url })
  wait ? await waitTillTabLoads(tabId) : null
}

async function updateActiveTabUrl(url: string, wait = false) {
  const activeTab = await activeTabData()
  const activeTabId = activeTab.id
  await Browser.tabs.update(activeTabId, { url })
  wait ? await waitTillTabLoads(activeTabId) : null
}

async function waitTillActiveTabLoads() {
  const activeTab = await activeTabData()
  const activeTabId = activeTab.id
  await waitTillTabLoads(activeTabId)
}

async function waitTillTabLoads(tabId: number) {
  await asyncSleep(0.5)

  const tab = await Browser.tabs.get(tabId)
  if (tab.status == 'loading') {
    await waitTillTabLoads(tabId)
  } else return
}

async function activeTabData() {
  const tabsData: any = await Browser.tabs.query({
    active: true,
  })
  return tabsData[0]
}

async function textOnAppIcon(iconText: string, tabId: number) {
  await Browser.action.setBadgeText({
    text: iconText,
    tabId,
  })
}

export {
  setLocalStorage,
  getLocalStorage,
  setSyncStorage,
  getSyncStorage,
  sendActiveTabMesage,
  sendTabMesageWithId,
  runTimeMessage,
  updateLocalStorage,
  reloadATab,
  createATab,
  updateATabUrl,
  activeTabData,
  textOnAppIcon,
  updateActiveTabUrl,
  waitTillTabLoads,
  waitTillActiveTabLoads
}
