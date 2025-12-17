import Browser from 'webextension-polyfill'
import { MESSAGING } from './const'
import { asyncSleep } from './utils'

const browserRef = Browser

const syncRef = browserRef.storage.sync
const localRef = browserRef.storage.local

export const STORE_NAME = 'LEIBILINGS_PRINT'

async function setSyncStorage(data) {
  await syncRef.set({ [STORE_NAME]: data })
}

async function setLocalStorage(data) {
  const ls = await getLocalStorage()
  await localRef.set({ [STORE_NAME]: { ...ls, ...data } })
}

async function getSyncStorage() {
  const data = await syncRef.get()
  return data[STORE_NAME]
}

async function getLocalStorage() {
  const data = await localRef.get()
  return data[STORE_NAME]
}

async function updateLocalStorage(newData) {
  const localStorage = await getLocalStorage()
  const newStorage = { ...localStorage, ...newData }
  await setLocalStorage(newStorage)
}

async function sendActiveTabMesage(data) {
  const activeTab = await activeTabData()
  return await browserRef.tabs.sendMessage(activeTab.id, { ...data })
}

async function sendTabMesageWithId(tabId, data) {
  return await browserRef.tabs.sendMessage(tabId, { ...data })
}

async function runTimeMessage(data) {
  return await browserRef.runtime.sendMessage(data)
}
const getTabData = async (tabId) => await browserRef.tabs.get(tabId)

async function reloadATab(tabId) {
  await browserRef.tabs.reload(tabId)
}

async function createATab(url) {
  return await browserRef.tabs.create({ url })
}

async function updateATabUrl(tabId, url, wait = false) {
  await browserRef.tabs.update(tabId, { url })
  wait ? await waitTillTabLoads(tabId) : null
}

async function updateActiveTabUrl(url, wait = false) {
  const activeTab = await activeTabData()
  const activeTabId = activeTab.id
  await browserRef.tabs.update(activeTabId, { url })
  wait ? await waitTillTabLoads(activeTabId) : null
}

async function updateActiveTabUrlBackground(url, wait = false) {
  await Browser.runtime.sendMessage({
    action: MESSAGING.UPDATE_ACTIVE_TAB_URL,
    url,
    shouldWait: wait,
  })
}

async function waitTillActiveTabLoadsBackground() {
  await Browser.runtime.sendMessage({
    action: MESSAGING.WAIT_TILL_ACTIVE_TAB_LOADS,
  })
}

async function waitTillActiveTabLoads() {
  const activeTab = await activeTabData()
  const activeTabId = activeTab.id
  await waitTillTabLoads(activeTabId)
}

async function waitTillTabLoads(tabId) {
  await asyncSleep(0.5)

  const tab = await browserRef.tabs.get(tabId)
  if (tab.status == 'loading') {
    await waitTillTabLoads(tabId)
  } else return
}

async function activeTabData() {
  const tabsData = await browserRef.tabs.query({
    active: true,
  })
  return tabsData[0]
}

async function textOnAppIcon(iconText, tabId) {
  await browserRef.action.setBadgeText({
    text: iconText,
    tabId,
  })
}

const updateAdData = async (data) => {
  const localStorage = await getLocalStorage()
  const newStorage = { ...localStorage, data: [...localStorage.data, ...data] }
  await setLocalStorage(newStorage)
}

const updateProcessingStatus = async (isProcessing) => {
  const localStorage = await getLocalStorage()
  const newStorage = { ...localStorage, isProcessing: isProcessing }
  await setLocalStorage(newStorage)
}

async function closeWindowIfExists(windowId) {
  try {
    await browserRef.windows.get(windowId)

    await browserRef.windows.remove(windowId)
    console.log('Window removed:', windowId)
  } catch (e) {
    console.log('Window does not exist anymore:', windowId)
  }
}

export {
  updateActiveTabUrlBackground,
  waitTillActiveTabLoadsBackground,
  closeWindowIfExists,
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
  getTabData,
  updateATabUrl,
  activeTabData,
  textOnAppIcon,
  updateActiveTabUrl,
  waitTillTabLoads,
  waitTillActiveTabLoads,
  updateAdData,
  updateProcessingStatus,
}
