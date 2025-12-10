import axios from 'axios'

import {
  closeWindowIfExists,
  getLocalStorage,
  getTabData,
  setLocalStorage,
  waitTillTabLoads,
} from '../common/browserMethods'
import { EBAY } from '../common/const'
import { browserRef, waitForCondition } from '../common/utils'

export const runLoginFlow = async () => {
  const scopeString = EBAY.SCOPES
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
  const tab = windowTab.tabs[0]
  await waitTillTabLoads(tab.id)
  await waitForCondition(async function () {
    const tabData = await getTabData(tab.id)
    return tabData.url.includes(EBAY.AUTH_REDIRECT_URL) && tabData.url.includes('code=')
  })
  return await getPermissionCode(tab.id, windowId)
}

const getPermissionCode = async (tabId, windowId) => {
  const tabData = await getTabData(tabId)
  const code = new URL(tabData.url).searchParams.get('code')
  const tokenData = await extractAuthData(code)
  await closeWindowIfExists(windowId)
  await updateAuthStorage(tokenData)
  return tokenData.access_token
}

const updateAuthStorage = async (tokenData) => {
  const { access_token, expires_in, refresh_token, refresh_token_expires_in, token_type } =
    tokenData
  await setLocalStorage({
    isAuthenticated: true,
    accessToken: access_token,
    expiresIn: expires_in,
    refreshToken: refresh_token,
    refreshTokenExpiresIn: refresh_token_expires_in,
    tokenType: token_type,
  })
}

async function extractAuthData(permissionCode) {
  const data = new URLSearchParams()
  data.append('grant_type', 'authorization_code')
  data.append('code', permissionCode)
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

async function getAccessToken() {
  const ls = await getLocalStorage()
  const userLoggedInPast = !!ls?.isAuthenticated && !!ls?.accessToken && !!ls?.refreshToken
  if (userLoggedInPast) {
    const res = await fetch('https://apiz.ebay.com/commerce/identity/v1/user/', {
      headers: { Authorization: `Bearer ${ls?.accessToken}` },
    })
    if (res.status == 401) {
      return await refreshAccessToken(ls?.refreshToken)
    } else {
      return ls?.accessToken
    }
  } else {
    return await runLoginFlow()
  }
}

async function refreshAccessToken(refreshToken) {
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    scope: EBAY.SCOPES,
  })

  const res = await fetch('https://api.ebay.com/identity/v1/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + EBAY.AUTH_CODE,
    },
    body,
  })

  if (!res.ok) {
    return await runLoginFlow()
  }

  const data = await res.json()
  await updateAuthStorage(data)
  console.log('Access token refreshed---', data.access_token)
  return data.access_token
}

export const getItemData = async (itemId) => {
  let accessToken = await getAccessToken()

  let config = {
    method: 'get',
    url: `${EBAY.API_BASE_URL}buy/browse/v1/item/v1|${itemId}|0?Content-Type=application/json`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }

  const response = await axios.request(config)
  return response.data
}
