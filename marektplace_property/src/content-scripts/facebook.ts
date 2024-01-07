import Browser from 'webextension-polyfill'
import { updateLocalData } from '../common/apis'
import { MESSAGING } from '../common/constants'
import { asyncSleep, getItemId } from '../common/utils'
import { getLocalStorage, runTimeMessage } from '../common/browerMethods'
import { SHEET_HEADERS } from '../common/constants'

const collectData = async (spreadsheetId: string) => {
    const url = window.location.href
    const divesRef2: any = Array.from(document.querySelectorAll('a[href*="/propertyrentals/"]') ?? [])?.find((el: any) => el?.innerText == 'Property to rent')?.parentElement?.parentElement
    const title = divesRef2?.querySelector('h1')?.innerText
    const price = divesRef2?.innerText?.split("\n").find((el: any) => el?.toLowerCase()?.includes('/month') || el?.toLowerCase()?.includes('/ month'))

    const gridRef = Array.from(document.querySelectorAll('span') ?? [])?.find(el => el.innerText.includes('Report this listing'))?.parentElement?.parentElement
    const newDivRef: any = Array.from(gridRef?.children ?? [])

    const loca: any = gridRef?.querySelector("i[style*='-261px'],i[style*='-260px'],i[style*='-262px']")?.parentElement?.parentElement?.innerText

    const propDetailsDiv = newDivRef?.find((el: any) => el.innerText.toLowerCase().includes('listed ') || el.innerText.toLowerCase().includes('dog and cat friendly') || el.innerText?.toLowerCase()?.includes("dog and cat-friendly") || el.innerText.toLowerCase().includes(' square feet'))


    const propDetailsDivText = propDetailsDiv?.innerText ?? ''
    const listedOn = propDetailsDivText?.split("\n")?.find((el: any) => el.includes("Listed ")) ?? ''
    const isPetFriendly = propDetailsDivText?.toLowerCase()?.includes("dog and cat friendly") || propDetailsDivText?.toLowerCase()?.includes("dog and cat-friendly") ? "Dog and cat friendly" : ""
    const sqft = propDetailsDivText?.split("\n")?.find((el: any) => el?.includes(" square feet")) ?? ''

    const rentalLocationDiv = newDivRef.find((item: any) => item?.innerText?.toLowerCase()?.includes("property for rent location"))
    const loc = rentalLocationDiv?.innerText?.replace('Rental Location', '')?.replace('Location is approximate', '')?.replace("undefined", '')?.replace("\n", '').replace("Property for rent location", '')

    const unitDetailsDiv = newDivRef.find((item: any) => item?.innerText?.toLowerCase()?.includes("unit detail"))
    const unitDetailsText = unitDetailsDiv?.innerText
    const bedrooms = unitDetailsText?.match(/(\d+)\s*(beds|beds)/)?.[0]?.replace(/( beds| bed)/g, '')
    const bathrooms = unitDetailsText?.match(/(\d+)\s*(baths|bath)/)?.[0]?.replace(/( baths| bath)/g, '')
    const unitDetails = unitDetailsText?.replace(/(Unit Details)/g, '') ?? ''

    const propDescriptionDiv = newDivRef.find((item: any) => item?.innerText?.toLowerCase()?.includes("description"))
    const allSpans = Array.from(propDescriptionDiv?.querySelectorAll('span')) as HTMLElement[]
    const moreButton = allSpans.find(el => el.innerText == 'See more') as HTMLElement
    moreButton?.click()
    await asyncSleep(2)
    const description = propDescriptionDiv?.innerText?.replace(/(Description)/g, '').replace("See less", "").replace("See translation", "") ?? ''

    const sellerRef: any = document.querySelector("a[href*='/marketplace/profile/'][aria-label]") as HTMLElement
    const sellerUrl = sellerRef?.href
    const sellerName = sellerRef?.getAttribute("aria-label")
    const images = Array.from(document.querySelectorAll("div[aria-label*='Thumbnail'] img") ?? [])?.map((el: any) => el?.src)

    const itemId = getItemId(url)
    const folderid = await runTimeMessage({
        message: MESSAGING.CREATE_FOLDER,
        data: {
            folderName: itemId,
        }
    })
    const imagesLink = []
    for (const imageIndex in images) {
        const data = await runTimeMessage({
            message: MESSAGING.SAVE_IMAGE, data: {
                folderid, imageIndex, imageUrl: images[imageIndex]
            }
        })
        const imageLink = `https://drive.google.com/file/d/${data?.id}/view`
        imagesLink.push(imageLink)
    }

    const imgFolder = `https://drive.google.com/drive/u/0/folders/${folderid}`

    const sheetRowData = [url, itemId, title, price, loca, sqft, isPetFriendly, listedOn, description, unitDetails, sellerUrl, imgFolder]

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

