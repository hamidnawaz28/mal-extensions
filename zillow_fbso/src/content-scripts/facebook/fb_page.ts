import Browser from 'webextension-polyfill'
import { MESSAGING } from '../../common/constants'
import { asyncSleep } from '../../common/utils'
import { enterText, fillDynamicSelect, findElementWithText, iconButtonClick, uploadImage } from '../utils'

const entry = () => {
  console.log('Facebook page script added')

  Browser.runtime.onMessage.addListener(async function (request: any) {
    const { message, prop } = request
    if (message === MESSAGING.UPLOAD_TO_FB_PAGE) {
      const { images, price, address, bedrooms, baths, sq_ft, special } = prop
      console.log(`${MESSAGING.UPLOAD_TO_FB_PAGE} data `, prop);

      await asyncSleep(2)
      const newPostButtonRef = findElementWithText("span", "What's on your mind?")
      newPostButtonRef.click()
      // await waitTillElementExists('div[aria-label="Create post"] div[aria-label="Close"]')
      await asyncSleep(10)
      // Fields
      const detailsRef = document.querySelector(`div[aria-label="What's on your mind?"]`) as HTMLElement
      enterText(detailsRef, special)
      await asyncSleep(2)
      // await fillTextField("What's on your mind?", special)

      // Icon button
      await iconButtonClick("Check in")
      await asyncSleep(4)
      await fillDynamicSelect("Where are you?", address)
      await asyncSleep(1)
      const backButtonref = document.querySelector('div[aria-label="Search for location"] div[aria-label="Back"]') as HTMLElement
      backButtonref.click()

      // Images
      await iconButtonClick("Photo/video")
      const toPostImages = images?.slice(0, 20) || []
      for (const element of toPostImages) {
        await uploadImage(element)
      }
      // await iconButtonClick("Post")
      return true
    }
  })
}

entry()
