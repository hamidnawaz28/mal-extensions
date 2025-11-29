const getOrderDetails = async () => {
  const orderId = '234324'
  const itemTitle = 'a r'
  const firstName = 'firstName'
  const lastName = 'lastName'
  const address = 'address'
  const city = 'city'
  const postCode = 'postcode'
  const email = 'email'
  return {
    orderId,
    itemTitle,
    firstName,
    lastName,
    address,
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
      orderData: await getOrderDetails(),
    })
  })
  findElementWithText('div', 'Order details').appendChild(btn)
}

addOrderPlaceButton()
