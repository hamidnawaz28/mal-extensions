import Browser from 'webextension-polyfill'
import { updateLocalData } from '../common/apis'
import { MESSAGING } from '../common/constants'
import { asyncSleep, getItemId } from '../common/utils'
import { getLocalStorage, runTimeMessage } from '../common/browerMethods'
import { SHEET_HEADERS } from '../common/constants'

const collectData = async (spreadsheetId: string) => {
    const url = window.location.href
    const dataRef: any = document.querySelector("[aria-label='Message']")?.parentElement?.parentElement?.parentElement?.parentElement

    const dataDivRef: any = Array.from(dataRef.children)

    const headlineRef: any = dataDivRef?.[0]
    const title = headlineRef.querySelector("h1:nth-child(1) span")?.innerText
    const price = headlineRef.querySelector("div:nth-child(2)>div>span")?.innerText
    const detailsRef: any = dataDivRef?.[1]?.children?.[0]
    const locationRef: any = Array.from(detailsRef.children)?.[0]
    const location = locationRef?.innerText
    const listedOn = detailsRef?.innerText?.split('\n').find((el: any) => el?.includes("Listed")) ?? ''
    const isPetFriendly = dataRef?.innerText?.includes("Dog and cat friendly") ? "Dog and cat friendly" : ""
    const unitDetailsDivRef = dataDivRef.find((item: any) => item.innerText.includes("Unit Details")) as HTMLElement
    const unitDetailsText = unitDetailsDivRef?.innerText
    const bedrooms = unitDetailsText?.match(/(\d+)\s*(beds|beds)/)?.[0]?.replace(/( beds| bed)/g, '')
    const bathrooms = unitDetailsText?.match(/(\d+)\s*(baths|bath)/)?.[0]?.replace(/( baths| bath)/g, '')
    const sqft = unitDetailsText?.match(/(\d+)\s*(square feet)/)?.[0]?.replace(/( square feet)/g, '') ?? ''
    const unitDetails = unitDetailsText?.replace(/( Unit Details)/g, '') ?? ''
    const descriptionDivRef = dataDivRef.find((item: any) => item.innerText.includes("Description")) as HTMLElement
    const description = descriptionDivRef?.innerText?.replace(/(Description)/g, '') ?? ''

    const sellerRef = document.querySelector("a[href*='/marketplace/profile/'][aria-label]") as HTMLElement
    const sellerUrl = sellerRef?.getAttribute("href")
    const sellerName = sellerRef?.getAttribute("aria-label")
    const images = Array.from(document.querySelectorAll("div[aria-label*='Thumbnail'] img"))?.map((el: any) => el?.src)
    const itemId = getItemId(url)
    const folderid = await runTimeMessage({
        message: MESSAGING.CREATE_FOLDER,
        data: {
            folderName: itemId
        }
    })
    const imagesLink = []
    for (const imageIndex in images) {
        await runTimeMessage({
            message: MESSAGING.SAVE_IMAGE, data: {
                folderid, imageIndex, imageUrl: images[imageIndex]
            }
        })
        imagesLink.push(`${itemId}/${imageIndex}.jpg`)
    }

    const sheetRowData = [url, title, price, location, sqft, isPetFriendly, listedOn, description, unitDetails, sellerUrl, images.join(" ")]
    await runTimeMessage({
        message: MESSAGING.UPDATE_EXCEL_SHEET_DATA,
        data: {
            spreadsheetId,
            row: sheetRowData
        }
    })
    return {
        itemId,
        sellerName,
        itemUrl: url,
        title,
        price,
        bedrooms,
        bathrooms,
        pet: isPetFriendly,
        sqft,
        unitDetails,
        description,
        sellerUrl,
        location,
        listedOn,
        images
    }
}

const entry = () => {
    Browser.runtime.onMessage.addListener(async function (request: any) {
        const { message } = request
        if (message === MESSAGING.COLLECT_BATCH_PROPERTY_DATA) {
            const spreadsheetId = await runTimeMessage({
                message: MESSAGING.CREATE_EXCEL_FILE
            })
            await updateLocalData({ spreadsheetId })

            await runTimeMessage({
                message: MESSAGING.UPDATE_EXCEL_SHEET_DATA,
                data: {
                    spreadsheetId,
                    row: SHEET_HEADERS
                }
            })

            const propsRef = Array.from(document.querySelectorAll("a[href*='/marketplace/item/']")) as HTMLElement[]

            for (const prop of propsRef) {
                prop.click()
                await asyncSleep(10)
                await collectData(spreadsheetId)
                const closeButtonRef = document.querySelector("[aria-label='Close']") as HTMLElement
                closeButtonRef?.click()
                await asyncSleep(4)
            }
        }
        if (message === MESSAGING.COLLECT_SINGLE_PROPERTY_DATA) {
            const ls = await getLocalStorage()
            let spreadsheetId = ''
            if (!!ls.spreadsheetId) {
                spreadsheetId = ls.spreadsheetId
            }
            else {
                spreadsheetId = await runTimeMessage({
                    message: MESSAGING.CREATE_EXCEL_FILE
                })
                await runTimeMessage({
                    message: MESSAGING.UPDATE_EXCEL_SHEET_DATA,
                    data: {
                        spreadsheetId,
                        row: SHEET_HEADERS
                    }
                })
                await updateLocalData({ spreadsheetId })
            }
            await collectData(spreadsheetId)
        }
    })
}

entry()

