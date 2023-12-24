import Browser from 'webextension-polyfill'
import { MESSAGING } from '../common/constants'
import { asyncSleep } from '../common/utils'
import { fillDynamicSelect, fillTextField, findElementWithText, iconButtonClick, uploadImage } from './utils'

const entry = () => {
  console.log('Facebook Script Added')

  Browser.runtime.onMessage.addListener(async function (request: any) {
    const { message, site } = request
    if (message === MESSAGING.UPLOAD_ITEM) {
      const { propertyData } = request
      const { images: imagesUrl, price, address, bedrooms, baths, sq_ft, special } = propertyData
      console.log(`${site} data `, propertyData);

      const newPostButtonRef = findElementWithText("span", "What's on your mind?")
      newPostButtonRef.click()

      // Fields
      await fillTextField("What's on your mind?", special)

      // Icon button
      await iconButtonClick("Check in")
      await fillDynamicSelect("Where are you?", address)
      const backButtonref = document.querySelector('div[aria-label="Search for location"] div[aria-label="Back"]') as HTMLElement
      backButtonref.click()

      // Images
      await iconButtonClick("Photo/video")
      const toPostImages = imagesUrl?.slice(0, 20) || []
      for (const element of toPostImages) {
        await uploadImage(element, site)
        await asyncSleep(4)
      }
      await iconButtonClick("Post")
      return true
    }
  })
}

entry()
