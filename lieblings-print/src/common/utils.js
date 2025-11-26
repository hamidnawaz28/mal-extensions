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

function waitTillRefDisappear(refElement, maxTime = 40000, intervalTime = 500) {
  return new Promise((resolve, reject) => {
    const start = Date.now()

    const interval = setInterval(() => {
      if (!refElement) {
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

async function uploadImage(imageUrl, uploadRef) {
  let imageBlob = null

  await runTimeMessage({
    action: MESSAGING.SET_BLOB_FROM_URL,
    imageUrl,
  })
  imageBlob = await getBlogStorage()
  await setBlobStorage('')

  const image = await fetch(imageBlob)
    .then((res) => res.blob())
    .then((blob) => new File([blob], `${+new Date()}.jpg`, { type: 'image/jpg' }))

  const dt = new DataTransfer()
  dt.items.add(image)

  uploadRef.files = dt.files

  // Trigger change for React/Vue frameworks
  uploadRef.dispatchEvent(new Event('change', { bubbles: true }))
  // const dropEvent = new DragEvent('drop', { bubbles: true, dataTransfer: new DataTransfer() })
  // dropEvent?.dataTransfer?.items.add(image)
  // uploadRef?.dispatchEvent(dropEvent)
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

export {
  writeTextToRef,
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
}
