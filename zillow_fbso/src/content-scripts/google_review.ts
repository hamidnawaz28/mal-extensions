import Browser from 'webextension-polyfill'
import { MESSAGING } from '../common/constants'
import { asyncSleep } from '../common/utils'
import { dropDownSelect, fillDynamicSelect, fillTextField, uploadImage } from './utils'

const entry = () => {
  console.log('Facebook Script Added')

  Browser.runtime.onMessage.addListener(async function (request: any) {
    const { message, prop } = request
    if (message === MESSAGING.UPLOAD_TO_FB_PERSONAL_POST) {

      const { images: imagesUrl, price, address, bedrooms, baths, sq_ft, special } = prop
      console.log(`${MESSAGING.UPLOAD_TO_FB_PERSONAL_POST} data `, prop);

      // Dropdowns
      await dropDownSelect("Property for sale or rent", "For sale")
      await dropDownSelect("Property type", "House")

      // Fields
      await fillTextField('Number of bedrooms', bedrooms)
      await fillTextField('Number of bathrooms', baths)
      await fillTextField('Price', price)
      await fillTextField('Property description', special)
      await fillTextField('Property square feet', sq_ft)

      // Dynamic Dropdown
      await fillDynamicSelect('Property address', address)

      // Images
      const toPostImages = imagesUrl?.slice(0, 20) || []
      for (const element of toPostImages) {
        await uploadImage(element)
        await asyncSleep(4)
      }

      return true
    }
  })
}

entry()

