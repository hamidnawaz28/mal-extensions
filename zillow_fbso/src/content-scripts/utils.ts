import { asyncSleep, getBlogStorage, runTimeMessage, setBlobStorage } from "../common/browerMethods"
import { MESSAGING, VehicleSiteTypes } from "../common/constants"

export const enterText = (ref: any, text: string) => {
    ref.focus()
    document.execCommand('insertText', false, text)
}

export const findElementWithText = (selector: string, text: string) =>
    Array.from(document.querySelectorAll(selector)).find(
        (el: any) => el.innerText == text,
    ) as HTMLElement

export const cleanString = (str: string) => str.replace(/\\|"|\\r/g, '')

export const dropDownSelect = async (labelText: string, value: string) => {
    await asyncSleep(0.5)
    const elementRef = document.querySelector(`[aria-label='${labelText}']`) as HTMLElement
    elementRef.click()
    await asyncSleep(1)
    findElementWithText('span', value).click()
}

export const fillTextField = async (selector: string, value: string) => {
    const ref = document.querySelector(`[aria-label*='${selector}']`)
    enterText(ref, value)
    await asyncSleep(1)
}

export const fillDynamicSelect = async (selector: string, value: string) => {
    await fillTextField(selector, value)
    await asyncSleep(4)
    const firstAddress = document.querySelector('ul[aria-label*="suggested searches"] li') as HTMLElement
    firstAddress?.click()
}

export const iconButtonClick = async (selector: string) => {
    const buttonRef = document.querySelector(`[aria-label='${selector}']`) as HTMLElement
    buttonRef.click()
    await asyncSleep(2)
}

export async function uploadImage(imageUrl: string, site: VehicleSiteTypes) {

    let imageBlob: any = null

    await runTimeMessage({
        message: MESSAGING.SET_BLOB_FROM_URL,
        data: { imageUrl },
    })
    imageBlob = await getBlogStorage()
    await setBlobStorage('')

    const image = await fetch(imageBlob)
        .then((res) => res.blob())
        .then((blob) => new File([blob], `${+new Date()}.jpg`, { type: 'image/jpg' }))


    const addPhotoBtns = document.querySelectorAll('span[dir="auto"]')
    const addPhotoBtn = Array.from(addPhotoBtns).find(
        (btn) =>
            btn.textContent?.toLowerCase() === 'add photos/videos' ||
            btn.textContent?.toLowerCase() === 'add photos' ||
            btn.textContent?.toLowerCase() === 'add photo',
    )
    const dropEvent = new DragEvent('drop', { bubbles: true, dataTransfer: new DataTransfer() })
    dropEvent?.dataTransfer?.items.add(image)
    addPhotoBtn?.dispatchEvent(dropEvent)
}