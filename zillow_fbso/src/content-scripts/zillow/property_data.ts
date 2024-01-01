import Browser from 'webextension-polyfill'
import { MESSAGING } from '../../common/constants'
import { findElementWithTextIncludes } from '../utils';
import { asyncSleep, scrollTillBottom } from '../../common/utils';
import { updateData } from '../../common/browerMethods';
import { apiFactory } from '../../common/apis';

const entry = async () => {
    console.log('Zillow data script added');
    Browser.runtime.onMessage.addListener(async function (request: any) {
        const { message } = request

        // For agent listing
        // if (message) {
        //     const propDetailRef = document.querySelector("#home-detail-lightbox-container") as HTMLElement

        //     const priceRef = propDetailRef?.querySelector('span[data-testid="price"]') as HTMLElement
        //     const price = priceRef?.innerText.replace('$', '')

        //     const addressRef = propDetailRef?.querySelector("div[class*='styles__AddressWrapper'] h1") as HTMLElement
        //     const address = addressRef?.innerText

        //     const bedContainerRef = findElementWithTextIncludes(propDetailRef, "div[data-testid='bed-bath-sqft-fact-container']", 'beds')
        //     const bedroomsRef = bedContainerRef?.querySelector("span:nth-child(1)") as HTMLElement
        //     const bedrooms = bedroomsRef?.innerText

        //     const bathContainerRef = findElementWithTextIncludes(propDetailRef, "div[data-testid='bed-bath-sqft-fact-container']", 'bath')
        //     const bathsRef = bathContainerRef?.querySelector("span:nth-child(1)") as HTMLElement
        //     const baths = bathsRef?.innerText

        //     const sqftContainerRef = findElementWithTextIncludes(propDetailRef, "div[data-testid='bed-bath-sqft-fact-container']", 'sqft')
        //     const sqftRef = sqftContainerRef?.querySelector("span:nth-child(1)") as HTMLElement
        //     const sqft = sqftRef?.innerText?.replace(/[,.]/g, '')

        //     const articleRef = document.querySelector("article[expandcontent][closecontent]") as HTMLElement
        //     const articaleShowMoreRef = articleRef?.querySelector("button") as HTMLElement
        //     articaleShowMoreRef?.click()
        //     await asyncSleep(2)
        //     const articalContentRef = articleRef?.querySelector("div div") as HTMLElement
        //     const special = articalContentRef?.innerText

        //     const allImagesPopupButtonRef = document.querySelector('button[class*="StyledGallerySeeAllPhotosButton"]') as HTMLElement
        //     allImagesPopupButtonRef?.click()
        //     await asyncSleep(4)

        //     const element = document.querySelector('section[role="dialog"] [class*="DialogBody"]') as HTMLElement
        //     scrollTillBottom(element)
        //     await asyncSleep(6)
        //     const imagesRef = Array.from(element.querySelectorAll('picture img')) as HTMLElement[]
        //     const images = imagesRef?.map(el => el.getAttribute('src'))
        //     const zillowListingUrl = location.href

        //     const sellerPhoneNumber = ''
        //     const data = { images, price, address, bedrooms, baths, sq_ft: sqft, special, seller_phone_number: sellerPhoneNumber, zillow_listing_url: zillowListingUrl }
        //     await apiFactory.saveListing(data)
        //     await updateData({ prop: data })
        // }
        if (message === MESSAGING.COLLECT_ZILLOW_PROP_DATA) {

            const propDetailRef = document.querySelector("[data-testid='home-details-chip-container']") as HTMLElement


            const priceRef = propDetailRef?.querySelector('span[data-testid="price"]') as HTMLElement
            const price = priceRef?.innerText.replace('$', '')

            const addressRef = propDetailRef?.querySelector("div[class*='PriceChangeAndAddressRow__StyledPriceChangeAndAddressRow'] h1") as HTMLElement
            const address = addressRef?.innerText

            const bedContainerRef = findElementWithTextIncludes(propDetailRef, "span[data-testid='bed-bath-item'] span", 'bd') as HTMLElement
            const bedroomsRef = bedContainerRef?.parentElement?.querySelector("strong") as HTMLElement
            const bedrooms = bedroomsRef?.innerText

            const bathContainerRef = findElementWithTextIncludes(propDetailRef, "span[data-testid='bed-bath-item'] span", 'ba') as HTMLElement
            const bathsRef = bathContainerRef?.parentElement?.querySelector("strong") as HTMLElement
            const baths = bathsRef?.innerText

            const sqftContainerRef = findElementWithTextIncludes(propDetailRef, "span[data-testid='bed-bath-item'] span", 'sqft') as HTMLElement
            const sqftRef = sqftContainerRef?.parentElement?.querySelector("strong") as HTMLElement
            const sqft = sqftRef?.innerText?.replace(/[,.]/g, '')

            const overViewRef = document.querySelector("[class*='OverviewStatsComponents__StyledOverviewStats']") as HTMLElement
            const moreButtonRef = overViewRef?.parentElement?.querySelector('button') as HTMLElement
            moreButtonRef?.click()
            await asyncSleep(2)
            const articalContentRef = overViewRef?.parentElement?.querySelector("div:nth-child(1)") as HTMLElement
            const special = articalContentRef?.innerText

            const element = document.querySelector("[data-testid='macro-media-column']") as HTMLElement
            scrollTillBottom(element?.parentElement?.parentElement?.parentElement)
            await asyncSleep(6)
            const imagesRef = Array.from(element.querySelectorAll('img')) as HTMLElement[]
            const images = imagesRef?.map(el => el.getAttribute('src'))
            const zillowListingUrl = location?.href

            const ownerRef = document.querySelector("[data-testid='attribution-PROPERTY_OWNER'] span") as HTMLElement
            const sellerPhoneNumber = ownerRef?.innerText ?? ''
            const data = { image: images?.[0], price, address, bedrooms, baths, sq_ft: sqft, special, seller_phone_number: sellerPhoneNumber, zillow_listing_url: zillowListingUrl }
            await apiFactory.saveListing(data)

            await updateData({ prop: data })
        }
    })
}

entry()