import Browser from 'webextension-polyfill'
import { getLocalStorage, setLocalStorage } from '../../common/browserMethods'
import { ADD_PRODUCT, MESSAGING } from '../../common/const'
import { asyncSleep, buttonInstance, checkboxInstance } from '../../common/utils'
import { getAllItemsId } from '../../firebase/apis'

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
      const stopButton = buttonInstance('Stop Uploading', 'stop-upload')
      const sortButton = buttonInstance('Sort', 'sort-items')

      const menuContainer = getMenuContainer()
      menuContainer.appendChild(sortButton)
      menuContainer.appendChild(uploadTriggerButton)
      menuContainer.appendChild(stopButton)
      sortButton.addEventListener('click', async () => {
        sortButton.innerText = 'Sorting...'
        sortButton.disabled = true

        try {
          const alreadyAddedItemsId = await getAllItemsId()
          const uploadedSet = new Set(alreadyAddedItemsId)

          const list = document.querySelector('ul.srp-results.srp-list')
          if (!list) return

          const items = Array.from(list.querySelectorAll('li[data-listingid]'))

          const uploadedItems = []
          const normalItems = []

          items.forEach((item) => {
            const itemId = item.getAttribute('data-listingid')

            if (itemId && uploadedSet.has(itemId)) {
              markAsUploaded(item)
              uploadedItems.push(item)
            } else {
              normalItems.push(item)
            }
          })
          ;[...uploadedItems, ...normalItems].forEach((item) => {
            list.appendChild(item)
          })
        } catch (err) {
          console.error('Sort failed:', err)
          alert('Failed to sort uploaded items')
        } finally {
          sortButton.innerText = 'Sort'
          sortButton.disabled = false
        }
      })

      stopButton.addEventListener('click', async () => {
        await setLocalStorage({
          running: false,
        })
        const ls = await getLocalStorage()
        const openedWindows = ls?.openedWindows
        await Browser.runtime.sendMessage({
          action: MESSAGING.DELETE_WINDOWS,
          openedWindows,
        })
      })
      uploadTriggerButton.addEventListener('click', async () => {
        const items = Array.from(document.querySelectorAll('ul li[data-listingid]'))
        const itemsList = items
          .filter((item) => item.querySelector('.select-checkbox')?.checked)
          .map((item) => {
            return {
              itemId: item.querySelector('.select-checkbox').parentElement.getAttribute('itemid'),
              title: item.querySelector('.su-styled-text.primary.default').innerText,
            }
          })
        if (itemsList.length == 0) {
          alert('Select an item to upload')
          return
        }
        console.log('itemsList---', itemsList)
        const alreadyAddedItemsId = await getAllItemsId()
        const existingSet = new Set(alreadyAddedItemsId)
        const newItems = itemsList.filter((item) => !existingSet.has(item.itemId))
        const duplicateCount = itemsList.length - newItems.length
        if (duplicateCount != 0)
          alert(`Processing ${newItems.length} remainig items, ${duplicateCount} are duplicate`)

        if (newItems.length == 0) return
        await setLocalStorage({
          running: true,
          openedWindows: [],
        })
        await Browser.runtime.sendMessage({
          action: ADD_PRODUCT.INJECT_ADD_PRODUCT_SCRIPT,
          itemsList: newItems,
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
const markAsUploaded = (item) => {
  if (!item || item.querySelector('.uploaded-label')) return

  const label = document.createElement('span')
  label.innerText = 'Uploaded'
  label.className = 'uploaded-label'

  Object.assign(label.style, {
    marginLeft: '6px',
    fontSize: '11px',
    color: '#2ecc71',
    fontWeight: 'bold',
  })

  item.appendChild(label)
}

keepAddingButtons()
