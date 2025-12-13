importScripts('ExtPay.js')
import { todayDateString } from '../common/appUtils'
import { setLocalStorage } from '../common/browserMethods'
import {
  APP_DATA,
  APP_SETTINGS,
  CHAT_PATH,
  CHECK_USAGE_LIMIT,
  EXTENSION_ID,
  IS_USER_ONBOARDED,
  MACTRAC_API_BASE_URL,
  SCAN_MESSAGE,
  USER_IDENTIFIER,
  USER_STATUS,
  USER_TOKEN,
} from '../common/const'

const DAILY_LIMIT = 5

const initExtPay = () => {
  const extpay = ExtPay(EXTENSION_ID)
  extpay.startBackground()
  extpay.onPaid.addListener((user) => {
    checkSubscriptionStatus()
  })
}

initExtPay()

function initStorage() {
  const initSettings = {
    maintanance: 2000,
    desiredIntake: 2000,
    startDate: todayDateString(),
    startWeight: 180,
    unit: 0,
  }

  setLocalStorage(IS_USER_ONBOARDED, false)
  setLocalStorage(USER_TOKEN, '')
  setLocalStorage(APP_DATA, {})
  setLocalStorage(APP_SETTINGS, initSettings)

  setLocalStorage(USER_STATUS, {})
  setLocalStorage(USER_IDENTIFIER, '')
}
chrome.runtime.onInstalled.addListener(() => {
  checkSubscriptionStatus()
  initStorage()
})

chrome.runtime.onStartup.addListener(() => {
  checkSubscriptionStatus()
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  handleMessage(request, sender, sendResponse)
  return true
})

async function checkSubscriptionStatus() {
  try {
    const extpay = ExtPay(EXTENSION_ID)
    const user = await extpay.getUser()

    const userStatus = {
      paid: user.paid,
      subscriptionStatus: user.subscriptionStatus || null,
      plan: user.plan || null,
      email: user.email || null,
      subscriptionCancelAt: user.subscriptionCancelAt || null,
      trialStartedAt: user.trialStartedAt || null,
      installedAt: user.installedAt || null,
      lastChecked: new Date().toISOString(),
    }

    await chrome.storage.local.set({
      [USER_STATUS]: userStatus,
    })
  } catch (error) {
    await chrome.storage.local.set({
      [USER_STATUS]: {
        paid: false,
        error: true,
        errorMessage: error.message,
        lastChecked: new Date().toISOString(),
      },
    })
  }
}

async function checkUsageLimit() {
  try {
    const extpay = ExtPay(EXTENSION_ID)
    const user = await extpay.getUser()
    const isPaid = user.paid

    if (isPaid) {
      return {
        success: true,
        canUse: true,
        unlimited: true,
      }
    }

    const userIdentifier = await getUserIdentifier(user)
    const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD format
    const usageKey = `usage_${userIdentifier}_${today}`

    const usageResult = await chrome.storage.local.get([usageKey])
    const currentUsage = usageResult[usageKey] || 0

    return {
      success: true,
      canUse: currentUsage < DAILY_LIMIT,
      count: currentUsage,
      limit: DAILY_LIMIT,
      remaining: DAILY_LIMIT - currentUsage,
      unlimited: false,
    }
  } catch (error) {
    return { success: false, canUse: false, message: error.message }
  }
}

async function incrementUsage() {
  try {
    const extpay = ExtPay(EXTENSION_ID)
    const user = await extpay.getUser()

    if (user.paid) {
      return { success: true, unlimited: true }
    }
    const userIdentifier = await getUserIdentifier(user)
    const today = new Date().toISOString().split('T')[0]
    const usageKey = `usage_${userIdentifier}_${today}`

    const usageResult = await chrome.storage.local.get([usageKey])
    const currentUsage = usageResult[usageKey] || 0

    if (currentUsage >= DAILY_LIMIT) {
      return {
        success: false,
        error: 'Daily limit reached',
        count: currentUsage,
        limit: DAILY_LIMIT,
        remaining: 0,
      }
    }

    const newCount = currentUsage + 1
    await chrome.storage.local.set({
      [usageKey]: newCount,
    })

    return {
      success: true,
      count: newCount,
      limit: DAILY_LIMIT,
      remaining: DAILY_LIMIT - newCount,
    }
  } catch (error) {
    console.error('Error incrementing usage:', error)
    return {
      success: false,
      error: error.message,
    }
  }
}

async function getUserIdentifier(user) {
  try {
    let identifier = 'anonymous'

    if (user.email) {
      identifier = btoa(user.email).substring(0, 16)
    } else if (user.installedAt) {
      // Use installation date + browser info as fallback
      const browserInfo = navigator.userAgent.substring(0, 50)
      identifier = btoa(user.installedAt.toString() + browserInfo).substring(0, 16)
    } else {
      // Fallback: create and store a pseudo-random ID
      const stored = await chrome.storage.local.get([USER_IDENTIFIER])
      if (stored[USER_IDENTIFIER]) {
        identifier = stored[USER_IDENTIFIER]
      } else {
        identifier = btoa(Math.random().toString() + Date.now().toString()).substring(0, 16)
        await chrome.storage.local.set({
          [USER_IDENTIFIER]: identifier,
        })
      }
    }

    return identifier
  } catch (error) {
    console.error('Error creating user identifier:', error)
    return 'fallback_' + Math.random().toString(36).substring(2, 10)
  }
}

async function getUserStatus() {
  const result = await chrome.storage.local.get([USER_STATUS])
  return result[USER_STATUS] || null
}

async function openPaymentPage() {
  const extpay = ExtPay(EXTENSION_ID)
  await extpay.openPaymentPage()
}

function unwrapOpenAI(data) {
  const choice = data?.choices?.[0]
  let text = choice?.message?.content ?? choice?.delta?.content ?? null
  if (typeof text !== 'string') return data
  text = text.trim()
  if (text.startsWith('```')) {
    text = text
      .replace(/^```[a-zA-Z]*\s*/, '')
      .replace(/```$/, '')
      .trim()
  }
  try {
    return JSON.parse(text)
  } catch {}
  const cleaned = text
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/,\s*([}\]])/g, '$1')
  try {
    console.log(JSON.parse(cleaned))
    return JSON.parse(cleaned)
  } catch {}
  const m = cleaned.match(/\{[\s\S]*\}/m)
  if (m) {
    try {
      return JSON.parse(m[0])
    } catch {}
  }
  return data
}

async function handleMessage(request, sender, sendResponse) {
  try {
    switch (request.type) {
      case CHECK_USAGE_LIMIT:
        const usageData = await checkUsageLimit()
        sendResponse(usageData)
        break

      case 'INCREMENT_USAGE':
        const result = await incrementUsage()
        sendResponse(result)
        break

      case 'GET_USER_STATUS':
        const status = await getUserStatus()
        sendResponse({ success: true, status })
        break

      case 'OPEN_PAYMENT_PAGE':
        await openPaymentPage()
        sendResponse({ success: true })
        break

      case 'CHECK_SUBSCRIPTION_STATUS':
        await checkSubscriptionStatus()
        const newStatus = await getUserStatus()
        sendResponse({ success: true, status: newStatus })
        break

      case SCAN_MESSAGE:
        try {
          const { [USER_TOKEN]: token } = await chrome.storage.local.get([USER_TOKEN])

          // Include tab URL if not provided (helps your server logs)
          const payload = { ...request.payload }
          if (!payload.url && sender?.tab?.url) payload.url = sender.tab.url

          const controller = new AbortController()
          const timeout = setTimeout(() => controller.abort('timeout'), 45000)

          const r = await fetch(`${MACTRAC_API_BASE_URL}${CHAT_PATH}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify(payload),
            signal: controller.signal,
          })

          clearTimeout(timeout)

          if (r.status === 401) {
            try {
              chrome.tabs.sendMessage(sender?.tab?.id || 0, {
                type: 'REAUTH_REQUIRED',
              })
            } catch {}
            return sendResponse({ success: false, error: 'auth_required' })
          }

          const data = await r.json().catch(() => ({}))
          const result = unwrapOpenAI(data)
          return sendResponse({ result })
        } catch (e) {
          return sendResponse({ success: false, error: String(e?.message || e) })
        }

      default:
        sendResponse({ success: false, error: 'Unknown message type' })
    }
  } catch (error) {
    console.error('Error handling message:', error)
    sendResponse({ success: false, error: error.message })
  }
}
