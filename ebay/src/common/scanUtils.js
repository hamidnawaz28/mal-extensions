import { collectContext } from './appUtils'
import { SCAN_MESSAGE } from './const'
import { asyncSleep, stringToNumber } from './utils'

const SCAN_TIMEOUT_IN_MS = 25000

function callBackgroundScan(payload, timeout = SCAN_TIMEOUT_IN_MS) {
  return new Promise((resolve, reject) => {
    let done = false
    const timeoutRef = setTimeout(() => {
      if (!done) {
        done = true
        reject(new Error('Scan timed out.'))
      }
    }, timeout)

    try {
      console.log({ SCAN_MESSAGE, payload })
      chrome.runtime.sendMessage({ type: SCAN_MESSAGE, payload }, (resp) => {
        if (done) return
        clearTimeout(timeoutRef)

        if (chrome.runtime.lastError) {
          return reject(new Error(chrome.runtime.lastError.message || 'Runtime error'))
        }
        if (!resp) return reject(new Error('No response from background.'))
        console.log('Background scan response:', resp)
        const candidate = resp.result ?? resp.data ?? resp
        if (!candidate || typeof candidate !== 'object') {
          return reject(new Error('Unexpected background shape.'))
        }
        resolve(parseMaybeLLM(candidate))
      })
    } catch (e) {
      clearTimeout(timeoutRef)
      reject(e)
    }
  })
}

// Extract strict JSON from OpenAI chat completion envelopes (with code fences, etc.)
function parseMaybeLLM(data) {
  // If it already looks like your schema, pass through
  if (data && (data.macros_per_serving || data.macros_total || data.per || data.tot)) return data

  // Handle OpenAI Chat Completions envelope
  const choice = data?.choices?.[0]
  let text = choice?.message?.content ?? choice?.delta?.content ?? null
  if (typeof text !== 'string') return data // not an envelope; return as-is

  // Strip ``` blocks (```json ... ```)
  text = text.trim()
  if (text.startsWith('```')) {
    text = text
      .replace(/^```[a-zA-Z]*\s*/, '')
      .replace(/```$/, '')
      .trim()
  }

  // Try straight parse
  try {
    return JSON.parse(text)
  } catch {}

  // Lenient cleanup: smart quotes, trailing commas
  const cleaned = text
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/,\s*([}\]])/g, '$1')
  try {
    return JSON.parse(cleaned)
  } catch {}

  // Fallback: grab the first { ... } block
  const m = cleaned.match(/\{[\s\S]*\}/m)
  if (m) {
    try {
      return JSON.parse(m[0])
    } catch {}
  }

  // If all else fails, return the original so UI can show an error/raw
  console.log({ data })
  return data
}

function normalizeResult(res) {
  if (!res || typeof res !== 'object')
    return {
      perServing: {},
      total: {},
      servings: null,
      servingSize: null,
      confidence: null,
      assumptions: [],
    }
  const servingDetails = res.macros_per_serving || res.per_serving || res.per || {}
  const total = res.macros_total || res.total || res.totals || {}
  const perServing = {
    calories: stringToNumber(servingDetails?.calories),
    protein: stringToNumber(servingDetails?.protein_g),
    carbs: stringToNumber(servingDetails?.carbs_g),
    fats: stringToNumber(servingDetails?.fat_g),
  }

  return {
    perServing,
    total,
    servings: res.servings ?? escapeHtml(res.servings_count) ?? null,
    servingSize: res.serving_size ?? escapeHtml(res.servingSize) ?? null,
    confidence: Math.round(res.confidence * 100) ?? null,
    assumptions: Array.isArray(res.assumptions) ? res.assumptions.map((el) => escapeHtml(el)) : [],
  }
}

function escapeHtml(s) {
  return String(s).replace(
    /[&<>"']/g,
    (m) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '&gt;': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      }[m]),
  )
}

async function scanPage(message = '', setScanning) {
  try {
    setScanning(true)
    const lastContext = collectContext()
    const result = await callBackgroundScan(lastContext)
    const model = result?.model || 'background'
    const details = normalizeResult(result)
    const data = {
      ...details,
      model,
    }
    await asyncSleep(2)
    setScanning(false)
    return prepareScanResults(true, message, data)
  } catch (e) {
    await asyncSleep(2)
    setScanning(false)
    return prepareScanResults(false, e.message, {})
  }
}

const prepareScanResults = (success, message, data) => {
  return {
    success,
    message,
    data,
  }
}

export const scanHandle = async (setScanning) => {
  try {
    var extensionUsage = window.extensionUsage
    if (!extensionUsage) {
      window.extensionUsage = new ExtensionUsageManager()
      extensionUsage = window.extensionUsage
    }

    if (extensionUsage) {
      await extensionUsage.refreshSubscriptionStatus()
      const isPaid = extensionUsage.isPaid()
      if (isPaid) return await scanPage('paid_user', setScanning)
      else {
        var result = await extensionUsage.handleFeatureRequest()
        if (result && result.success) {
          return await scanPage('trial_user', setScanning)
        }
      }
    } else {
      return await scanPage('neither_paid_or_trial_user', setScanning)
    }
  } catch (e) {
    console.error('Scan trigger failed:', e)
    return await scanPage('error run', setScanning)
  }
}
