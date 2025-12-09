import Browser from 'webextension-polyfill'
import { MESSAGING, TEMU_MESSAGES } from '../../common/const'
import { asyncSleep, buttonInstance } from '../../common/utils'
import { DUMMY_DATA } from './dummyData'

async function keepAddingButtons() {
  await Browser.runtime.sendMessage({
    action: MESSAGING.WAIT_TILL_ACTIVE_TAB_LOADS,
  })
  await asyncSleep(1000)
  // Browser.runtime.sendMessage({
  //   action: MESSAGING.OPEN_OAUTH,
  // })
  setInterval(async () => {
    const items = document.querySelectorAll('ul li[data-listingid]')
    // const items = document.querySelectorAll('#__next') //FOR HAMID.COM

    items.forEach((item) => {
      const uploadButton = item.querySelector('#upload-to-temu')

      const btn = buttonInstance('Upload on Temu', 'upload-to-temu')
      btn.addEventListener('click', async () => {
        const itemId = item.dataset.listingid
        // const itemData = await Browser.runtime.sendMessage({
        //   action: MESSAGING.GET_EBAY_ITEM_DATA,
        //   itemId: itemId,
        // })

        await Browser.runtime.sendMessage({
          action: TEMU_MESSAGES.INJECT_ADD_PRODUCT_SCRIPT,
          itemData: DUMMY_DATA,
        })
      })
      if (!uploadButton) {
        item.prepend(btn)
      }
    })
  }, 1000)
}

keepAddingButtons()
