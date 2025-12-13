import { APP_DATA, APP_SETTINGS, IS_USER_ONBOARDED, USER_TOKEN } from './const'

import { getLocalStorage, setLocalStorage } from './browserMethods'
import { stringToNumber } from './utils'

async function getDataByDay(dateString) {
  const res = await getLocalStorage(APP_DATA)
  return Array.isArray(res?.[dateString]) ? res[dateString] : []
}

export function todayDateString() {
  return new Date().toISOString().split('T')[0]
}

export const getSettings = async () => {
  const res = await getLocalStorage(APP_SETTINGS)
  const maintanance = stringToNumber(res.maintanance) || 2000
  const desiredIntake = stringToNumber(res.desiredIntake) || maintanance
  const startDate = res.startDate || todayDateString(new Date(new Date().getFullYear(), 0, 1))
  const startWeight = stringToNumber(res.startWeight) || 180
  const unit = res.unit

  return {
    maintanance,
    desiredIntake,
    startDate,
    startWeight,
    unit,
  }
}

export const saveSettings = async (data) => {
  const settings = await getSettings()
  settings.maintanance = stringToNumber(data.maintanance) || settings.maintanance
  const desiredIntake = stringToNumber(data.desiredIntake)
  settings.desiredIntake = desiredIntake > 0 ? desiredIntake : settings.maintanance
  settings.startDate = data.startDate || settings.startDate
  settings.startWeight = stringToNumber(data.startWeight) || settings.startWeight
  settings.unit = data.unit
  await setLocalStorage(APP_SETTINGS, settings)
}

const sumDay = (data) => {
  return data.reduce(
    (acc, currentDayData) => {
      acc.calories += stringToNumber(currentDayData.calories)
      acc.protein += stringToNumber(currentDayData.protein)
      acc.carbs += stringToNumber(currentDayData.carbs)
      acc.fats += stringToNumber(currentDayData.fats)
      return acc
    },
    { calories: 0, protein: 0, carbs: 0, fats: 0 },
  )
}

export async function sumDayData() {
  const currentDayData = await getTodayData()
  return sumDay(currentDayData)
}

export async function getTodayData() {
  const dateString = todayDateString()
  return await getDataByDay(dateString)
}

export async function saveManualData(itemData) {
  const dateString = todayDateString()
  const currentDayData = await getDataByDay(dateString)
  currentDayData.push(itemData)
  const appData = await getLocalStorage(APP_DATA)
  appData[dateString] = currentDayData
  await setLocalStorage(APP_DATA, appData)
}

export async function deleteDataById(id) {
  const dateString = todayDateString()
  const currentDayData = await getDataByDay(dateString)
  const updatedData = currentDayData.filter((item) => item.id !== id)
  const appData = await getLocalStorage(APP_DATA)
  appData[dateString] = updatedData
  await setLocalStorage(APP_DATA, appData)
}

export async function getCalendarData() {
  const appData = await getLocalStorage(APP_DATA)
  if (!appData) return []

  const days = Object.keys(appData)
    .filter((dateString) => appData[dateString].length > 0)
    .sort()
    .map((dateString) => {
      const entries = Array.isArray(appData[dateString]) ? appData[dateString] : []
      const totals = sumDay(entries)

      const [year, month, day] = dateString.split('-').map(Number)
      const date = new Date(year, month - 1, day)
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })
      const dayNumber = date.getDate()

      return {
        dateString,
        dayName,
        dayNumber,
        ...totals,
      }
    })

  return days
}

export const storeSignInInfo = async (token) => {
  await setLocalStorage(USER_TOKEN, token)
  await setLocalStorage(IS_USER_ONBOARDED, true)
}

export const getUserOnboardedStatus = async () => {
  return await getLocalStorage(IS_USER_ONBOARDED)
}
function scrapeNutritionTable() {
  const CANDIDATE_SELECTORS = ['table', 'section', 'article', 'div', 'ul']
  const KEYWORDS = [
    'nutrition',
    'nutritional',
    'calorie',
    'calories',
    'protein',
    'carb',
    'carbohydrate',
    'fat',
    'total fat',
  ]
  const norm = (s) =>
    String(s || '')
      .replace(/\s+/g, ' ')
      .replace(/\u00A0/g, ' ')
      .trim()

  let best = null
  for (const sel of CANDIDATE_SELECTORS) {
    for (const node of document.querySelectorAll(sel)) {
      const t = norm(node.textContent || '')
      if (!t) continue
      if (KEYWORDS.some((k) => t.toLowerCase().includes(k))) {
        if (!best || t.length < best.text.length) best = { el: node, text: t }
      }
    }
  }
  if (!best) return {}

  const text = best.text
  const mCalKcal = /calories[^0-9]{0,10}(\d{2,4})(?:\s*k?cal)?\b/i.exec(text)
  const mCalKJ = /(\d{3,5})\s*kJ\b/i.exec(text)
  const mProtein = /(protein|prot)[^0-9]{0,10}(\d{1,3}(?:\.\d+)?)\s*g\b/i.exec(text)
  const mCarbs = /(carb|carbohydrate)s?[^0-9]{0,10}(\d{1,3}(?:\.\d+)?)\s*g\b/i.exec(text)
  const mFat = /(total\s+fat|fat)[^0-9]{0,10}(\d{1,3}(?:\.\d+)?)\s*g\b/i.exec(text)

  const out = {}
  if (mCalKcal) out.calories = Number(mCalKcal[1])
  else if (mCalKJ) {
    const kj = Number(mCalKJ[1])
    if (Number.isFinite(kj)) out.calories = Math.round(kj / 4.184)
  }

  if (mProtein) out.protein_g = Number(mProtein[2])
  if (mCarbs) out.carbs_g = Number(mCarbs[2])
  if (mFat) out.fat_g = Number(mFat[2])

  const kcal = out.calories
  const saneGrams = (g) => Number.isFinite(g) && g >= 0 && g <= 250

  if (out.protein_g === kcal || !saneGrams(out.protein_g)) delete out.protein_g
  if (out.carbs_g === kcal || !saneGrams(out.carbs_g)) delete out.carbs_g
  if (out.fat_g === kcal || !saneGrams(out.fat_g)) delete out.fat_g

  const vals = [out.protein_g, out.carbs_g, out.fat_g].filter((v) => typeof v === 'number')
  if (vals.length && kcal != null && vals.every((v) => v === kcal)) {
    delete out.protein_g
    delete out.carbs_g
    delete out.fat_g
  }
  if (out.calories != null) {
    const c = out.calories
    if (!Number.isFinite(c) || c < 20 || c > 3000) delete out.calories
  }
  return out
}
export function collectContext() {
  const meta = {}
  document.querySelectorAll('meta[name],meta[property]').forEach((m) => {
    const k = m.getAttribute('name') || m.getAttribute('property')
    const v = m.getAttribute('content')
    if (k && v) meta[k] = v
  })

  const recipe_meta = {
    servings: textNum(
      document.querySelector('[itemprop="recipeYield"], .servings, .recipe-servings'),
    ),
    servingSize: textClean(document.querySelector('[itemprop="servingSize"], .serving-size')),
  }

  const ingredients = Array.from(
    document.querySelectorAll('[itemprop="recipeIngredient"], .ingredient, .ingredients li'),
  )
    .slice(0, 40)
    .map((el) => textClean(el))
    .filter(Boolean)

  const instructions_excerpt = Array.from(
    document.querySelectorAll('[itemprop="recipeInstructions"], .instructions, .method, .steps'),
  )
    .map((el) => el.innerText || el.textContent || '')
    .join('\n')
    .slice(0, 1800)

  const nutrition_table_scrape = scrapeNutritionTable()

  const visible_text_excerpt = (document.body.innerText || '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 5000)

  return {
    url: location.href,
    meta,
    recipe_meta,
    ingredients,
    instructions_excerpt,
    nutrition_table_scrape,
    visible_text_excerpt,
  }
}

export function textClean(el) {
  return ((el && (el.innerText || el.textContent || '')) || '').trim()
}

export function textNum(el) {
  const t = textClean(el)
  const n = Number(String(t).replace(/[^\d.]/g, ''))
  return isFinite(n) ? n : null
}
