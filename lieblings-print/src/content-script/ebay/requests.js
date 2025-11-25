let config = {
  method: 'get',
  url: 'https://auth.ebay.com/oauth2/authorize?client_id=hamidnaw-Liebling-PRD-66e90c06a-7c6994e0&response_type=code&redirect_uri=hamid_nawaz-hamidnaw-Liebli-koxfrczys&scope=https://api.ebay.com/oauth/api_scope%20https://api.ebay.com/oauth/api_scope/sell.marketing.readonly%20https://api.ebay.com/oauth/api_scope/sell.marketing%20https://api.ebay.com/oauth/api_scope/sell.inventory.readonly%20https://api.ebay.com/oauth/api_scope/sell.inventory%20https://api.ebay.com/oauth/api_scope/sell.account.readonly%20https://api.ebay.com/oauth/api_scope/sell.account%20https://api.ebay.com/oauth/api_scope/sell.fulfillment.readonly%20https://api.ebay.com/oauth/api_scope/sell.fulfillment%20https://api.ebay.com/oauth/api_scope/sell.analytics.readonly%20https://api.ebay.com/oauth/api_scope/sell.finances%20https://api.ebay.com/oauth/api_scope/sell.payment.dispute%20https://api.ebay.com/oauth/api_scope/commerce.identity.readonly%20https://api.ebay.com/oauth/api_scope/sell.reputation%20https://api.ebay.com/oauth/api_scope/sell.reputation.readonly%20https://api.ebay.com/oauth/api_scope/commerce.notification.subscription%20https://api.ebay.com/oauth/api_scope/commerce.notification.subscription.readonly%20https://api.ebay.com/oauth/api_scope/sell.stores%20https://api.ebay.com/oauth/api_scope/sell.stores.readonly%20https://api.ebay.com/oauth/scope/sell.edelivery%20https://api.ebay.com/oauth/api_scope/commerce.vero%20https://api.ebay.com/oauth/api_scope/sell.inventory.mapping%20https://api.ebay.com/oauth/api_scope/commerce.message%20https://api.ebay.com/oauth/api_scope/commerce.feedback%20https://api.ebay.com/oauth/api_scope/commerce.shipping',
}
import Browser from 'webextension-polyfill'

export const getGrantAccessCode = async () => {
  const windowTab = await Browser.windows.create({
    url: config.url,
    type: 'popup',
    width: 500,
    height: 700,
  })

  const windowId = windowTab.id
  const tabId = windowTab.tabs[0].id
  console.log(windowId, tabId)
  attachTabListeners(tabId, windowId)
  attachWindowListeners(windowId)
}

function attachTabListeners(tabId, windowId) {
  let updateDetected = false
  Browser.tabs.onUpdated.addListener(async (updatedTabId, changeInfo, tab) => {
    if (updatedTabId !== tabId) return

    if (
      updateDetected === false &&
      tab.url.includes(
        'https://auth2.ebay.com/oauth2/ThirdPartyAuthSucessFailure?isAuthSuccessful=',
      )
    ) {
      updateDetected = true
      console.log('Popup URL changed:', tab.url)
      if (tab.url.includes('code=')) {
        const code = new URL(tab.url).searchParams.get('code')
        console.log('Got OAuth code:', code)
        await exchangeCodeForToken(code)
        Browser.windows.remove(windowId)
      }
    }
  })

  Browser.tabs.onRemoved.addListener((removedTabId) => {
    if (removedTabId === tabId) {
      console.log('Popup TAB closed by user')
    }
  })
}

function attachWindowListeners(windowId) {
  Browser.windows.onRemoved.addListener((removedWindowId) => {
    if (removedWindowId === windowId) {
      console.log('Popup WINDOW closed by user')
    }
  })
}

async function exchangeCodeForToken(code) {
  const data = new URLSearchParams()
  data.append('grant_type', 'authorization_code')
  data.append('code', code)
  data.append('redirect_uri', 'hamid_nawaz-hamidnaw-Liebli-koxfrczys')

  const response = await fetch('https://api.ebay.com/identity/v1/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization:
        'Basic aGFtaWRuYXctTGllYmxpbmctUFJELTY2ZTkwYzA2YS03YzY5OTRlMDpQUkQtNmU5MGMwNmFiNmJhLWI1ZmQtNGQzYy04OWE3LTE2M2Y=',
    },
    body: data.toString(),
  })

  const tokenData = await response.json()
  console.log(tokenData)
}
