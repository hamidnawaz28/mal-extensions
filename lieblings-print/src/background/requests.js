import axios from 'axios'

import { closeWindowIfExists, setLocalStorage } from '../common/browserMethods'
import { browserRef } from '../common/utils'

export const runLoginFlow = async () => {
  let config = {
    method: 'get',
    url: 'https://auth.ebay.com/oauth2/authorize?client_id=hamidnaw-Liebling-PRD-66e90c06a-7c6994e0&response_type=code&redirect_uri=hamid_nawaz-hamidnaw-Liebli-koxfrczys&scope=https://api.ebay.com/oauth/api_scope%20https://api.ebay.com/oauth/api_scope/sell.marketing.readonly%20https://api.ebay.com/oauth/api_scope/sell.marketing%20https://api.ebay.com/oauth/api_scope/sell.inventory.readonly%20https://api.ebay.com/oauth/api_scope/sell.inventory%20https://api.ebay.com/oauth/api_scope/sell.account.readonly%20https://api.ebay.com/oauth/api_scope/sell.account%20https://api.ebay.com/oauth/api_scope/sell.fulfillment.readonly%20https://api.ebay.com/oauth/api_scope/sell.fulfillment%20https://api.ebay.com/oauth/api_scope/sell.analytics.readonly%20https://api.ebay.com/oauth/api_scope/sell.finances%20https://api.ebay.com/oauth/api_scope/sell.payment.dispute%20https://api.ebay.com/oauth/api_scope/commerce.identity.readonly%20https://api.ebay.com/oauth/api_scope/sell.reputation%20https://api.ebay.com/oauth/api_scope/sell.reputation.readonly%20https://api.ebay.com/oauth/api_scope/commerce.notification.subscription%20https://api.ebay.com/oauth/api_scope/commerce.notification.subscription.readonly%20https://api.ebay.com/oauth/api_scope/sell.stores%20https://api.ebay.com/oauth/api_scope/sell.stores.readonly%20https://api.ebay.com/oauth/scope/sell.edelivery%20https://api.ebay.com/oauth/api_scope/commerce.vero%20https://api.ebay.com/oauth/api_scope/sell.inventory.mapping%20https://api.ebay.com/oauth/api_scope/commerce.message%20https://api.ebay.com/oauth/api_scope/commerce.feedback%20https://api.ebay.com/oauth/api_scope/commerce.shipping',
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
  const redirectUrl = 'https://auth2.ebay.com/oauth2/ThirdPartyAuthSucessFailure?isAuthSuccessful='

  browserRef.tabs.onUpdated.addListener(async (updatedTabId, changeInfo, tab) => {
    if (updatedTabId !== tabId) return
    if (updateDetected === false && tab.url.includes(redirectUrl)) {
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
  data.append('redirect_uri', 'hamid_nawaz-hamidnaw-Liebli-koxfrczys')

  const response = await axios.post(
    'https://api.ebay.com/identity/v1/oauth2/token',
    data.toString(),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization:
          'Basic aGFtaWRuYXctTGllYmxpbmctUFJELTY2ZTkwYzA2YS03YzY5OTRlMDpQUkQtNmU5MGMwNmFiNmJhLWI1ZmQtNGQzYy04OWE3LTE2M2Y=',
      },
    },
  )

  console.log('tokenData----', response.data)
  return response.data
}

export const getItemData = async (accessToken, itemId) => {
  let config = {
    method: 'get',
    url: `https://api.ebay.com/buy/browse/v1/item/v1|${itemId}|0?Content-Type=application/json`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }

  const response = await axios.request(config)
  return response
}
