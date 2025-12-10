import Browser from 'webextension-polyfill'
import { ADD_PRODUCT, MESSAGING } from '../../common/const'
import { asyncSleep, buttonInstance } from '../../common/utils'

async function keepAddingButtons() {
  await Browser.runtime.sendMessage({
    action: MESSAGING.WAIT_TILL_ACTIVE_TAB_LOADS,
  })
  await asyncSleep(1000)
  setInterval(async () => {
    const items = document.querySelectorAll('ul li[data-listingid]')
    // const items = document.querySelectorAll('#__next') //FOR HAMID.COM

    items.forEach((item) => {
      const uploadButton = item.querySelector('#upload-to-temu')
      const btn = buttonInstance('Upload on Temu', 'upload-to-temu')
      btn.addEventListener('click', async () => {
        const itemId = item.dataset.listingid

        await Browser.runtime.sendMessage({
          action: ADD_PRODUCT.INJECT_ADD_PRODUCT_SCRIPT,
          itemId,
        })
      })
      if (!uploadButton) {
        item.appendChild(btn)
      }
    })
  }, 1000)
}

keepAddingButtons()
