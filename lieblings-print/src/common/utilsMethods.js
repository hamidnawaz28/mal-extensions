import { getBlogStorage, runTimeMessage, setBlobStorage } from './browserMethods'
import { MESSAGING } from './const'

export const writeTextToRef = (ref, text) => {
  ref.focus()
  document.execCommand('insertText', false, text)
}

export function waitTillRefDisappear(refElement, maxTime = 40000, intervalTime = 500) {
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
export const getBlobFromImgUrl = async (imageUrl) => {
  const resp = await fetch(imageUrl, { mode: 'no-cors' }).then((response) => response.blob())
  return await blobToBase64(resp)
}

export const findElementWithText = (selector, text) =>
  Array.from(document.querySelectorAll(selector)).find(
    (el) => el?.innerText?.toLowerCase() == text?.toLowerCase(),
  )

export const getNodeIndex = (nodeRef) => Array.from(nodeRef.parentNode.children).indexOf(nodeRef)
export const removeCm = (value) => value.replace(' cm', '')
async function blobToBase64(blob) {
  return new Promise((resolve, _) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.readAsDataURL(blob)
  })
}

export async function uploadImage(imageUrl, uploadRef) {
  let imageBlob = null

  await runTimeMessage({
    message: MESSAGING.SET_BLOB_FROM_URL,
    data: { imageUrl },
  })
  imageBlob = await getBlogStorage()
  await setBlobStorage('')

  const image = await fetch(imageBlob)
    .then((res) => res.blob())
    .then((blob) => new File([blob], `${+new Date()}.jpg`, { type: 'image/jpg' }))

  const dropEvent = new DragEvent('drop', { bubbles: true, dataTransfer: new DataTransfer() })
  dropEvent?.dataTransfer?.items.add(image)
  uploadRef?.dispatchEvent(dropEvent)
}
