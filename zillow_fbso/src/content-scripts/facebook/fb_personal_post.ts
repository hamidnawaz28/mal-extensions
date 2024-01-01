import Browser from 'webextension-polyfill'
import { MESSAGING } from '../../common/constants'
import { asyncSleep } from '../../common/utils'
import { fillDynamicSelect, fillTextField, findElementWithText, iconButtonClick, uploadImage } from '../utils'

const entry = () => {
  console.log('Facebook Personal Post Script Added')

  Browser.runtime.onMessage.addListener(async function (request: any) {
    const { message, prop } = request
    if (message === MESSAGING.UPLOAD_TO_FB_PERSONAL_POST) {
      const { images, price, address, bedrooms, baths, sq_ft, special } = prop
      console.log(`${MESSAGING.UPLOAD_TO_FB_PERSONAL_POST} data `, prop);

      const newPostButtonRef = findElementWithText("span", "Create a post")
      newPostButtonRef.click()

      // Fields
      await fillTextField("What's on your mind,", special)

      // Icon button
      await iconButtonClick("Check in")
      await fillDynamicSelect("Where are you?", address)
      const backButtonref = document.querySelector('div[aria-label="Search for location"] div[aria-label="Back"]') as HTMLElement
      backButtonref.click()

      // Images
      await iconButtonClick("Photo/video")
      const toPostImages = images?.slice(0, 20) || []
      for (const element of toPostImages) {
        await uploadImage(element)
        await asyncSleep(4)
      }
      await iconButtonClick("Post")
      return true
    }
  })
}

entry()


