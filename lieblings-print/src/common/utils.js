import Browser from 'webextension-polyfill'

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

async function urlToFile(imageUrl) {
  const res = await fetch(imageUrl)
  const blob = await res.blob()

  return new File([blob], `${Date.now()}.jpg`, { type: blob.type || 'image/jpeg' })
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
const parseDescription = (itemData) => {
  const htmlString = itemData?.description
  const parser = new DOMParser()
  const doc = parser.parseFromString(htmlString, 'text/html')
  const rows = [...doc.querySelectorAll('.description .MsoListParagraphCxSpLast')]
    .map((el) =>
      el.innerText
        .replace(/\s*\n\s*/g, ' ')
        .replace(/\s{2,}/g, ' ')
        .trim(),
    )
    .slice(0, 6)
  return rows
}
async function uploadImages(allImages, uploadRef) {
  const dt = new DataTransfer()
  for (let imageIndex = 0; imageIndex < allImages.length; imageIndex++) {
    const imageRef = allImages[imageIndex]
    const image = await urlToFile(imageRef.imageUrl)
    dt.items.add(image)
  }
  uploadRef.files = dt.files
  await asyncSleep(3000)
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
const inputInstance = (placeholder, id, type = 'text', style = {}) => {
  const input = document.createElement('input')
  input.type = type
  input.placeholder = placeholder
  input.id = id

  const inputStyle = {
    padding: '6px 10px',
    margin: '8px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    outline: 'none',
    fontSize: '12px',
    fontWeight: '500',
    color: '#333',
    background: '#fff',
    boxShadow: '0 3px 8px rgba(0,0,0,0.12)',
    transition: 'all 0.25s ease',
    width: '180px',
    ...style,
  }

  Object.assign(input.style, inputStyle)

  input.onmouseenter = () => {
    input.style.boxShadow = '0 5px 14px rgba(0,0,0,0.18)'
  }

  input.onmouseleave = () => {
    if (document.activeElement !== input) {
      input.style.boxShadow = '0 3px 8px rgba(0,0,0,0.12)'
    }
  }

  input.onfocus = () => {
    input.style.border = '1px solid #FF6A00'
    input.style.boxShadow = '0 0 0 2px rgba(255,106,0,0.25)'
  }

  input.onblur = () => {
    input.style.border = '1px solid #ddd'
    input.style.boxShadow = '0 3px 8px rgba(0,0,0,0.12)'
  }

  return input
}
const divInstance = (id, style = {}, content = null) => {
  const div = document.createElement('div')
  if (id) div.id = id

  const divStyle = {
    padding: '10px',
    margin: '8px',
    borderRadius: '6px',
    background: '#fff',
    boxShadow: '0 4px 12px rgba(0,0,0,0.14)',
    transition: 'all 0.25s ease',
    display: 'block',
    ...style,
  }

  Object.assign(div.style, divStyle)

  // Hover elevation
  div.onmouseenter = () => {
    div.style.transform = 'translateY(-2px)'
    div.style.boxShadow = '0 8px 20px rgba(0,0,0,0.22)'
  }

  div.onmouseleave = () => {
    div.style.transform = 'translateY(0)'
    div.style.boxShadow = '0 4px 12px rgba(0,0,0,0.14)'
  }

  // Optional content
  if (content) {
    if (typeof content === 'string') {
      div.innerHTML = content
    } else if (content instanceof Node) {
      div.appendChild(content)
    } else if (Array.isArray(content)) {
      content.forEach((node) => node && div.appendChild(node))
    }
  }

  return div
}
export {
  inputInstance,
  checkboxInstance,
  waitForCondition,
  waitTillRefAppears,
  writeTextToRef,
  clickUsingPosition,
  asyncSleep,
  waitTillRefDisappear,
  findElementWithText,
  waitForElement,
  uploadImages,
  getNodeIndex,
  sanitizeValues,
  findElementWithIncludeText,
  buttonInstance,
  urlToFile,
  divInstance,
  parseDescription,
}
