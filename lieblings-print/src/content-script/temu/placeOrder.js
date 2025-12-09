const getOrderDetails = () => {
  const orderId = findElementWithText('span', 'Order ID:')?.parentElement?.querySelector(
    'span:nth-child(2)',
  )?.innerText

  const itemTitle = document.querySelector(
    '[data-testid="beast-core-table-body-tr"] td:nth-child(2) [data-testid="beast-core-ellipsis"]',
  )?.innerText

  const fullName = findElementWithText('div', 'Recipient name')?.parentElement?.querySelector(
    'div:nth-child(2)',
  )?.innerText
  const parts = fullName?.trim()?.split(/\s+/)
  const firstName = parts?.[0] || ''
  const lastName = parts?.slice(1)?.join(' ') || ''

  const addressRef = findElementWithText('div', 'Shipping address')?.parentElement?.querySelector(
    'div:nth-child(2)',
  )
  const address = addressRef?.querySelector(':scope div>div:nth-child(1)')?.innerText
  const addressDetailRef = addressRef
    ?.querySelector(':scope div>div:nth-child(2)')
    ?.innerText?.split(' ')
    ?.map((el) => el?.replaceAll(/[(),]/g, ''))

  const postCode = addressDetailRef?.[0]
  const city = addressDetailRef?.[1]
  const state = addressDetailRef?.[2]

  const email = findElementWithText('div', 'Virtual email')?.parentElement?.querySelector(
    'div:nth-child(2)',
  )?.innerText

  return {
    orderId,
    itemTitle,
    firstName,
    lastName,
    address,
    state,
    city,
    postCode,
    email,
  }
}

import Browser from 'webextension-polyfill'
import { waitTillActiveTabLoadsBackground } from '../../common/browserMethods'
import { PLACE_ORDER } from '../../common/const'
import { asyncSleep, buttonInstance, findElementWithText } from '../../common/utils'

async function addOrderPlaceButton() {
  await waitTillActiveTabLoadsBackground()
  await asyncSleep(1000)

  const btn = buttonInstance('Sync Order', 'place-order')

  btn.addEventListener('click', async () => {
    await Browser.runtime.sendMessage({
      action: PLACE_ORDER.INJECT_PLACE_ORDER_SCRIPT,
      orderData: getOrderDetails(),
    })
  })
  findElementWithText('div', 'Order details').appendChild(btn)
}

addOrderPlaceButton()
