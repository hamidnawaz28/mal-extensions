import JSZip from 'jszip'
import Browser from 'webextension-polyfill'

export const browserRef = Browser

export function asyncSleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function findProductDescriptionShadowRoot() {
  const allElements = document.querySelectorAll('*')

  for (const el of allElements) {
    if (el.shadowRoot) {
      const desc = el.shadowRoot.querySelector('#product-description')
      if (desc) {
        return el.shadowRoot
      }
    }
  }
  return null
}

export const getDescriptionImages = () => {
  const shadowRoot = findProductDescriptionShadowRoot()
  if (shadowRoot) return Array.from(shadowRoot?.querySelectorAll('img'))?.map((el) => el?.src) ?? []
  else return []
}

export async function downloadImages(allImages, fileName) {
  const dt = new DataTransfer()
  for (let imageIndex = 0; imageIndex < allImages.length; imageIndex++) {
    const imageUrl = allImages[imageIndex]
    const image = await urlToFile(imageUrl)
    dt.items.add(image)
  }
  await downloadDataTransferFiles(dt, fileName)
}

async function urlToFile(imageUrl) {
  const res = await fetch(imageUrl)
  const blob = await res.blob()

  return await new File([blob], `${Date.now()}.jpg`, { type: blob.type || 'image/jpeg' })
}

async function downloadDataTransferFiles(dt, fileName) {
  const zip = new JSZip()

  const folder = zip.folder(fileName)

  for (const file of dt.files) {
    const buffer = await file.arrayBuffer()
    folder.file(file.name, buffer)
  }

  const zipBlob = await zip.generateAsync({ type: 'blob' })

  const url = URL.createObjectURL(zipBlob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${fileName}.zip`
  document.body.appendChild(a)
  a.click()

  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
