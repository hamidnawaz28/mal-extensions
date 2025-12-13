import Browser from 'webextension-polyfill'
import { ADD_PRODUCT, MESSAGING } from '../../common/const'
import { asyncSleep, buttonInstance, checkboxInstance } from '../../common/utils'

const getMenuContainer = () => {
  const menuContainer = document.querySelector('#menu-container')
  if (menuContainer) return menuContainer
  else {
    const menuContainer = document.createElement('div')
    menuContainer.id = 'menu-container'
    Object.assign(menuContainer.style, {
      display: 'flex',
    })
    const menuReference = document.querySelector('.srp-controls__row-2')
    menuReference.appendChild(menuContainer)
    return menuContainer
  }
}

async function keepAddingButtons() {
  await Browser.runtime.sendMessage({
    action: MESSAGING.WAIT_TILL_ACTIVE_TAB_LOADS,
  })
  await asyncSleep(1000)
  setInterval(async () => {
    const getSelectAllButton = document.querySelector('.select-all-checkbox')
    if (!getSelectAllButton) {
      const menuContainer = getMenuContainer()

      const selectAllCheckbox = checkboxInstance('All', 'select-all-checkbox')
      menuContainer.appendChild(selectAllCheckbox)

      selectAllCheckbox.addEventListener('click', async () => {
        const isMainChecked = selectAllCheckbox.querySelector('input').checked

        document.querySelectorAll('.select-checkbox').forEach((item) => {
          if (!item.checked && isMainChecked) {
            item.click()
          }
          if (item.checked && !isMainChecked) {
            item.click()
          }
        })
      })
    }

    const getUploadTriggerButton = document.querySelector('#upload-to-temu')
    if (!getUploadTriggerButton) {
      const uploadTriggerButton = buttonInstance('Upload on Temu', 'upload-to-temu')
      const menuContainer = getMenuContainer()
      menuContainer.appendChild(uploadTriggerButton)
      uploadTriggerButton.addEventListener('click', async () => {
        const items = Array.from(document.querySelectorAll('ul li[data-listingid]'))
        const itemsList = items
          .filter((item) => item.querySelector('.select-checkbox')?.checked)
          .map((item) =>
            item.querySelector('.select-checkbox').parentElement.getAttribute('itemid'),
          )
        if (itemsList.length == 0) {
          alert('Select an item to upload')
          return
        }
        console.log('itemsList---', itemsList)

        await Browser.runtime.sendMessage({
          action: ADD_PRODUCT.INJECT_ADD_PRODUCT_SCRIPT,
          itemsList,
        })
      })
    }

    const items = Array.from(document.querySelectorAll('ul li[data-listingid]'))
    items.forEach((item) => {
      const itemId = item.dataset.listingid
      const selectCheckBox = item.querySelector('.select-checkbox')
      if (!selectCheckBox) {
        const checkBox = checkboxInstance('Select', 'select-checkbox')
        checkBox.setAttribute('itemid', itemId)
        item.appendChild(checkBox)
      }
    })
  }, 1000)
}

keepAddingButtons()
