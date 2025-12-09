import Browser from 'webextension-polyfill'
import { getBlogStorage, runTimeMessage, setBlobStorage } from './browserMethods'
import { MESSAGING } from './const'

export const browserRef = Browser

const writeTextToRef = (ref, text) => {
  ref.focus()
  document.execCommand('insertText', false, text)
}

function asyncSleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function waitTillRefDisappear(selector, maxTime = 60000, intervalTime = 500) {
  return new Promise((resolve, reject) => {
    const start = Date.now()

    const interval = setInterval(() => {
      const loading = document.querySelector(selector)
      if (!loading) {
        clearInterval(interval)
        resolve(true)
      }

      if (Date.now() - start >= maxTime) {
        clearInterval(interval)
        reject()
      }
    }, intervalTime)
  })
}
function waitTillRefAppears(selector, text, maxTime = 60000, intervalTime = 500) {
  return new Promise((resolve, reject) => {
    const start = Date.now()

    const interval = setInterval(() => {
      const loading = findElementWithIncludeText(selector, text)
      if (loading) {
        clearInterval(interval)
        resolve(true)
      }

      if (Date.now() - start >= maxTime) {
        clearInterval(interval)
        reject()
      }
    }, intervalTime)
  })
}
const getBlobFromImgUrl = async (imageUrl) => {
  const resp = await fetch(imageUrl, { mode: 'no-cors' }).then((response) => response.blob())
  return await blobToBase64(resp)
}

const findElementWithText = (selector, text) =>
  Array.from(document.querySelectorAll(selector)).find(
    (el) => el?.innerText?.toLowerCase() == text?.toLowerCase(),
  )

const findElementWithIncludeText = (selector, text) =>
  Array.from(document.querySelectorAll(selector)).find((el) =>
    el?.innerText?.toLowerCase().includes(text?.toLowerCase()),
  )

const getNodeIndex = (nodeRef) => Array.from(nodeRef.parentNode.children).indexOf(nodeRef)

const sanitizeValues = (value) => value?.replace(/\s?(cm|kg|ml)/g, '')

async function blobToBase64(blob) {
  return new Promise((resolve, _) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.readAsDataURL(blob)
  })
}
const getImage = async (imageUrl) => {
  let imageBlob = null

  await runTimeMessage({
    action: MESSAGING.SET_BLOB_FROM_URL,
    imageUrl,
  })
  imageBlob = await getBlogStorage()
  await setBlobStorage('')

  return await fetch(imageBlob)
    .then((res) => res.blob())
    .then((blob) => new File([blob], `${+new Date()}.jpg`, { type: 'image/jpg' }))
}

async function clickUsingPosition(elementRef) {
  elementRef.scrollIntoView({ behavior: 'smooth', block: 'center' })
  await asyncSleep(3000)
  const rect = elementRef.getBoundingClientRect()
  const x = rect.left + rect.width / 2
  const y = rect.top + rect.height / 2

  const el = document.elementFromPoint(x, y)
  if (!el) return

  el.dispatchEvent(
    new MouseEvent('mousedown', {
      bubbles: true,
      clientX: x,
      clientY: y,
    }),
  )

  el.dispatchEvent(
    new MouseEvent('mouseup', {
      bubbles: true,
      clientX: x,
      clientY: y,
    }),
  )

  el.dispatchEvent(
    new MouseEvent('click', {
      bubbles: true,
      clientX: x,
      clientY: y,
    }),
  )
}

async function uploadImage(allImages, uploadRef) {
  const dt = new DataTransfer()
  for (let imageIndex = 0; imageIndex < allImages.length; imageIndex++) {
    const imageRef = allImages[imageIndex]
    const image = await getImage(imageRef.imageUrl)
    await asyncSleep(10000)
    dt.items.add(image)
  }
  uploadRef.files = dt.files
  await uploadRef.dispatchEvent(new Event('change', { bubbles: true }))
}

async function waitForElement(mainGridSelector, maxRetries = 50, interval = 2000) {
  const retries = 0
  const foundElement = false

  while (foundElement === false && retries < maxRetries) {
    const mainDiv = await mainGridSelector()

    if (mainDiv) return mainDiv
    await new Promise((res) => setTimeout(res, interval))
  }
  throw new Error('Element not found: ')
}

const buttonInstance = (title, id) => {
  const btn = document.createElement('button')
  btn.innerText = title
  btn.id = id
  btn.style.padding = '4px 8px'
  btn.style.border = 'none'
  btn.style.marginLeft = '8px'
  btn.style.marginRight = '8px'
  btn.style.borderRadius = '4px'
  btn.style.cursor = 'pointer'
  btn.style.fontSize = '12px'
  btn.style.fontWeight = '600'
  btn.style.color = '#fff'
  btn.style.background = 'linear-gradient(135deg, #FF6A00, #EE0979)'
  btn.style.boxShadow = '0 4px 10px rgba(0,0,0,0.15)'
  btn.style.transition = 'all 0.25s ease'
  btn.style.marginLeft = '10px'
  btn.style.display = 'inline-block'

  btn.onmouseenter = () => {
    btn.style.transform = 'scale(1.06)'
    btn.style.boxShadow = '0 6px 16px rgba(0,0,0,0.25)'
  }

  btn.onmouseleave = () => {
    btn.style.transform = 'scale(1)'
    btn.style.boxShadow = '0 4px 10px rgba(0,0,0,0.15)'
  }
  return btn
}
export {
  waitTillRefAppears,
  writeTextToRef,
  clickUsingPosition,
  asyncSleep,
  waitTillRefDisappear,
  findElementWithText,
  getBlobFromImgUrl,
  blobToBase64,
  waitForElement,
  uploadImage,
  getNodeIndex,
  sanitizeValues,
  findElementWithIncludeText,
  buttonInstance,
}
