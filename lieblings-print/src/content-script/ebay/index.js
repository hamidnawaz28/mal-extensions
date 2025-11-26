import Browser from 'webextension-polyfill'
import { MESSAGING, TEMU_MESSAGES } from '../../common/const'
import { asyncSleep } from '../../common/utils'
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
    // const items = document.querySelectorAll('ul li[data-listingid]')
    const items = document.querySelectorAll('#__next') //FOR HAMID.COM

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

const buttonInstance = (title, id) => {
  const btn = document.createElement('button')
  btn.innerText = title
  btn.id = id
  btn.style.padding = '10px 16px'
  btn.style.border = 'none'
  btn.style.borderRadius = '8px'
  btn.style.cursor = 'pointer'
  btn.style.fontSize = '14px'
  btn.style.fontWeight = '600'
  btn.style.color = '#fff'
  btn.style.background = 'linear-gradient(135deg, #FF6A00, #EE0979)'
  btn.style.boxShadow = '0 4px 10px rgba(0,0,0,0.15)'
  btn.style.transition = 'all 0.25s ease'
  btn.style.marginLeft = '10px'
  btn.style.display = 'inline-block'

  btn.onmouseenter = () => {
    btn.style.transform = 'scale(1.06)'
    btn.style.boxShadow = '0 6px 16px rgba(0,0,0,0.25)'
  }

  btn.onmouseleave = () => {
    btn.style.transform = 'scale(1)'
    btn.style.boxShadow = '0 4px 10px rgba(0,0,0,0.15)'
  }
  return btn
}

keepAddingButtons()
