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

const waitForCondition = async (conditionFunction, maxRetries = 200, interval = 1000) => {
  let retries = 0
  let condtionFullFilled = false

  while (condtionFullFilled === false && retries < maxRetries) {
    condtionFullFilled = await conditionFunction()
    retries++
    if (condtionFullFilled) return
    await new Promise((res) => setTimeout(res, interval))
  }
  throw new Error('Element not found: ')
}

const buttonInstance = (title, id, style = {}) => {
  const btn = document.createElement('button')
  btn.innerText = title
  btn.id = id
  const btnStyle = {
    padding: '4px 8px',
    border: 'none',
    margin: '8px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '600',
    color: '#fff',
    background: 'linear-gradient(135deg, #FF6A00, #EE0979)',
    boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
    transition: 'all 0.25s ease',
    display: 'inline-block',
    width: 'max-content',
    ...style,
  }
  Object.assign(btn.style, btnStyle)

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

const checkboxInstance = (labelText, className, style = {}) => {
  const wrapper = document.createElement('label')
  wrapper.style.display = 'inline-flex'
  wrapper.style.alignItems = 'center'
  wrapper.style.cursor = 'pointer'
  wrapper.style.margin = '8px'

  const checkbox = document.createElement('input')
  checkbox.type = 'checkbox'
  checkbox.className = className

  const checkboxStyle = {
    appearance: 'none',
    width: '18px',
    height: '18px',
    borderRadius: '4px',
    border: '2px solid #FF6A00',
    marginRight: '8px',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    background: '#fff',
    boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
    ...style,
  }

  Object.assign(checkbox.style, checkboxStyle)

  checkbox.addEventListener('change', () => {
    if (checkbox.checked) {
      checkbox.style.background = 'linear-gradient(135deg, #FF6A00, #EE0979)'
      checkbox.style.borderColor = 'transparent'
      checkbox.style.transform = 'scale(1.05)'
      checkbox.style.boxShadow = '0 6px 16px rgba(0,0,0,0.25)'
    } else {
      checkbox.style.background = '#fff'
      checkbox.style.borderColor = '#FF6A00'
      checkbox.style.transform = 'scale(1)'
      checkbox.style.boxShadow = '0 4px 10px rgba(0,0,0,0.15)'
    }
  })

  const label = document.createElement('span')
  label.innerText = labelText
  label.style.fontSize = '12px'
  label.style.fontWeight = '600'
  label.style.cursor = 'pointer'
  label.style.color = '#333'

  wrapper.appendChild(checkbox)
  wrapper.appendChild(label)

  return wrapper
}

export {
  checkboxInstance,
  waitForCondition,
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
