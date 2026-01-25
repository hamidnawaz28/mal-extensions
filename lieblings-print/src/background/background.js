import {
  closeWindowIfExists,
  getLocalStorage,
  setLocalStorage,
  updateActiveTabUrl,
  waitTillActiveTabLoads,
  waitTillTabLoads,
} from '../common/browserMethods'
import { ADD_PRODUCT, MESSAGING, PLACE_ORDER, SYNC_TRACKING_NUMBER } from '../common/const'
import { asyncSleep, browserRef } from '../common/utils'
import { addAnItemId } from '../firebase/apis'
import { getItemData } from './requests'

browserRef.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
  if (msg.action === MESSAGING.WAIT_TILL_ACTIVE_TAB_LOADS) {
    await waitTillActiveTabLoads()
    sendResponse({})
    return true
  }
})

browserRef.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
  if (msg.action === MESSAGING.UPDATE_ACTIVE_TAB_URL) {
    await updateActiveTabUrl(msg.url, msg.shouldWait)
    sendResponse({})
    return true
  }
})
browserRef.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
  if (msg.action === MESSAGING.DELETE_WINDOWS) {
    const openedWindows = msg?.openedWindows ?? []
    for (let index = 0; index < openedWindows.length; index++) {
      await closeWindowIfExists(openedWindows[index])
    }
    sendResponse({})
    return true
  }
})
browserRef.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
  if (msg.action === MESSAGING.UPDATE_ACTIVE_TAB_URL) {
    await updateActiveTabUrl(msg.url, msg.shouldWait)
    sendResponse({})
    return true
  }
})

const closeOpenWindows = async (openedWindows) => {
  await asyncSleep(20000)
  for (let index = 0; index < openedWindows.length; index++) {
    await closeWindowIfExists(openedWindows[index])
  }
}
browserRef.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
  if (msg.action === ADD_PRODUCT.INJECT_ADD_PRODUCT_SCRIPT) {
    await setLocalStorage({
      randomErrorCount: 0,
    })
    const itemsList = msg.itemsList
    for (let index = 0; index < itemsList.length; index++) {
      try {
        let ls = await getLocalStorage()
        if (!ls.running) {
          break
        }
        const item = itemsList[index]
        const itemData = await getItemData(item.itemId)
        const addProductUrl = 'https://seller-eu.temu.com/goods-category.html'
        const windowTab = await browserRef.windows.create({
          url: addProductUrl,
          type: 'popup',
          state: 'maximized',
        })

        const tabId = windowTab.tabs[0].id
        ls = await getLocalStorage()
        const openedWindows = ls?.openedWindows ?? []
        const oldWindows = openedWindows.filter((id) => id !== windowTab.id)
        closeOpenWindows(oldWindows)
        openedWindows.push(windowTab.id)
        await setLocalStorage({
          openedWindows,
        })
        await browserRef.scripting.executeScript({
          target: { tabId },
          files: ['addProductTemu.js'],
        })
        await asyncSleep(2000)

        await browserRef.tabs.sendMessage(tabId, {
          action: ADD_PRODUCT.ENTER_INITIAL_DETAILS,
          itemData: itemData,
          title: item.title,
        })

        browserRef.tabs.sendMessage(tabId, {
          action: ADD_PRODUCT.CLICK_ON_NEXT_BUTTON,
        })

        await waitTillTabLoads(tabId)

        await asyncSleep(5000)
        await browserRef.scripting.executeScript({
          target: { tabId },
          files: ['addProductTemu.js'],
        })

        await browserRef.tabs.sendMessage(tabId, {
          action: ADD_PRODUCT.ENTER_REMAINING_DETAILS,
          itemData,
        })
        await addAnItemId(item.itemId, {})
        // await browserRef.windows.remove(windowTab.id)
      } catch (err) {
        let ls = await getLocalStorage()
        const randomErrorCount = ls?.randomErrorCount ?? 0
        console.log(randomErrorCount, 'randomErrorCount----')

        if (randomErrorCount >= 5) {
          await setLocalStorage({
            running: false,
          })
          alert('Stopped due to repeated errors in adding products')
          break
        }
        await setLocalStorage({
          randomErrorCount: randomErrorCount + 1,
        })
        console.error('Error in adding product script:', err)
      }
    }

    sendResponse({})
    return true
  }
})

browserRef.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
  if (msg.action === PLACE_ORDER.INJECT_PLACE_ORDER_SCRIPT) {
    const orderData = msg.orderData
    console.log('Order data-----------', orderData)

    // const placeOrderUrl = `https://seller-eu.temu.com/order-detail.html?parent_order_sn=${orderData.orderId}`
    const placeOrderUrl = `https://lieblingsflair.de/wp-admin/admin.php?page=wc-orders&action=new`

    const windowTab = await browserRef.windows.create({
      url: placeOrderUrl,
      type: 'popup',
      state: 'maximized',
    })

    const tabId = windowTab.tabs[0].id

    await waitTillTabLoads(tabId)
    await asyncSleep(6000)
    await browserRef.scripting.executeScript({
      target: { tabId },
      files: ['placeLieblingsOrder.js'],
    })
    await asyncSleep(2000)

    await browserRef.tabs.sendMessage(tabId, {
      action: PLACE_ORDER.PLACE_ORDER,
      orderData: orderData,
    })

    sendResponse({})
    return true
  }
})
browserRef.runtime.onInstalled.addListener((details) => {
  setLocalStorage({
    isAuthenticated: false,
    running: false,
    openedWindows: [],
    randomErrorCount: 0,
  })
})

browserRef.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
  if (msg.action === SYNC_TRACKING_NUMBER.INJECT_SYNC_TRACKING_NUMBER_SCRIPT) {
    const trackingData = msg.trackingData

    // const placeOrderUrl = `https://seller-eu.temu.com/order-detail.html?parent_order_sn=${trackingData.orderId}`
    const placeOrderUrl = `https://seller-eu.temu.com/orders.html`

    const windowTab = await browserRef.windows.create({
      url: placeOrderUrl,
      type: 'popup',
      state: 'maximized',
    })

    const tabId = windowTab.tabs[0].id

    await waitTillTabLoads(tabId)
    await asyncSleep(1000)
    await browserRef.scripting.executeScript({
      target: { tabId },
      files: ['syncTemuTrackingNumber.js'],
    })

    await browserRef.tabs.sendMessage(tabId, {
      action: SYNC_TRACKING_NUMBER.SYNC_TRACKING_NUMBER,
      trackingData: trackingData,
    })

    sendResponse({})
    return true
  }
})
