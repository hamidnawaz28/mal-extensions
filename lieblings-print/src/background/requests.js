import axios from 'axios'

import { closeWindowIfExists, setLocalStorage } from '../common/browserMethods'
import { EBAY } from '../common/const'
import { browserRef } from '../common/utils'

export const runLoginFlow = async () => {
  const scopeString = EBAY.SCOPES.join('%20')
  let config = {
    method: 'get',
    url: `${EBAY.AUTH_BASE_URL}oauth2/authorize?client_id=${EBAY.CLIENT_ID}&response_type=code&redirect_uri=${EBAY.REDIRECT_URI}&scope=${scopeString}`,
  }

  const windowTab = await browserRef.windows.create({
    url: config.url,
    type: 'popup',
    width: 500,
    height: 700,
  })

  const windowId = windowTab.id
  const tabId = windowTab.tabs[0].id
  attachTabListeners(tabId, windowId)
  attachWindowListeners(windowId)
}

function attachTabListeners(tabId, windowId) {
  let updateDetected = false

  browserRef.tabs.onUpdated.addListener(async (updatedTabId, changeInfo, tab) => {
    if (updatedTabId !== tabId) return
    if (updateDetected === false && tab.url.includes(EBAY.AUTH_REDIRECT_URL)) {
      updateDetected = true
      if (tab.url.includes('code=')) {
        const code = new URL(tab.url).searchParams.get('code')
        await closeWindowIfExists(windowId)
        const tokenData = await getTokenUsingCode(code)
        const { access_token, expires_in, refresh_token, refresh_token_expires_in, token_type } =
          tokenData

        await setLocalStorage({
          authenticated: true,
          access_token,
          expires_in,
          refresh_token,
          refresh_token_expires_in,
          token_type,
        })
        console.log('Access Token:', access_token)
      }
    }
  })

  browserRef.tabs.onRemoved.addListener((removedTabId) => {
    if (removedTabId === tabId) {
      console.log('Popup TAB closed by user')
    }
  })
}

function attachWindowListeners(windowId) {
  browserRef.windows.onRemoved.addListener((removedWindowId) => {
    if (removedWindowId === windowId) {
      console.log('Popup WINDOW closed by user')
    }
  })
}

async function getTokenUsingCode(code) {
  const data = new URLSearchParams()
  data.append('grant_type', 'authorization_code')
  data.append('code', code)
  data.append('redirect_uri', EBAY.AUTH_REDIRECT_URI)

  const response = await axios.post(
    `${EBAY.API_BASE_URL}identity/v1/oauth2/token`,
    data.toString(),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${EBAY.AUTH_CODE}`,
      },
    },
  )

  console.log('tokenData----', response.data)
  return response.data
}

export const getItemData = async (accessToken, itemId) => {
  let config = {
    method: 'get',
    url: `${EBAY.API_BASE_URL}buy/browse/v1/item/v1|${itemId}|0?Content-Type=application/json`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }

  const response = await axios.request(config)
  return response
}
