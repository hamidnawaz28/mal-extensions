import Browser from 'webextension-polyfill'
import { MESSAGING } from '../../common/constants'
import { asyncSleep } from '../../common/utils'
import { dropDownSelect, fillDynamicSelect, fillTextField, uploadImage } from '../utils'


const entry = () => {
  console.log('Facebook marketplace script added')

  Browser.runtime.onMessage.addListener(async function (request: any) {
    const { message, prop } = request

    if (message === MESSAGING.UPLOAD_DATA_TO_FB_PROP_SALE_MARKETPLACE) {
      const { images, price, address, bedrooms, baths, sq_ft, special } = prop
      console.log(`${MESSAGING.UPLOAD_DATA_TO_FB_PROP_SALE_MARKETPLACE} data `, prop);

      // Dropdowns
      await dropDownSelect("Home for Sale or Rent", "For Sale")
      await dropDownSelect("Property type", "House")

      // Fields
      await fillTextField('Number of bedrooms', bedrooms)
      await fillTextField('Number of bathrooms', baths)
      await fillTextField('Price', price)
      await fillTextField('Property description', special)
      await fillTextField('Property square feet', sq_ft)

      // Dynamic dropdown
      await fillDynamicSelect('Property address', address)

      // Images
      const toPostImages = images?.slice(0, 20) || []
      for (const element of toPostImages) {
        await uploadImage(element)
      }

      return true
    }
  })
}

entry()
