import { PLACE_ORDER } from '../../common/const'
import {
  asyncSleep,
  browserRef,
  clickUsingPosition,
  findElementWithText,
  waitTillRefDisappear,
  writeTextToRef,
} from '../../common/utils'

browserRef.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
  if (msg.action === PLACE_ORDER.PLACE_ORDER) {
    await placeOrder(msg.orderData)
    sendResponse({})
  }
  return true
})

export const placeOrder = async (data) => {
  await addItems(data)
  await selectStatus()
  await selectMarketplace()
  await addInvoiceAddress(data)
  await addShippingAddress(data)
  await asyncSleep(2000)
  await addOrderNote()
  await asyncSleep(2000)
  await clickPlaceOrderButton()
}

const addOrderNote = async () => {
  const orderNotesRef = document.querySelector('#add_order_note')
  writeTextToRef(orderNotesRef, 'Temu Order')
  await asyncSleep(2000)
  document.querySelector('.add_note button.add_note').click()
  await asyncSleep(4000)
}

const enterFieldData = async (addressRef, selector, value) => {
  const elementRef = addressRef.querySelector(selector)
  writeTextToRef(elementRef, value)
  await asyncSleep(1000)
}

const invoiceAddressDetails = async (addressRef, data) => {
  await enterFieldData(addressRef, '._billing_first_name_field input', data.firstName)
  await enterFieldData(addressRef, '._billing_last_name_field  input', data.lastName)
  await enterFieldData(addressRef, '._billing_address_1_field input', data.address)
  await enterFieldData(addressRef, '._billing_city_field  input', data.city)
  await enterFieldData(addressRef, '._billing_postcode_field input', data.postCode)
}

const shippingAddressDetails = async (addressRef, data) => {
  await enterFieldData(addressRef, '._shipping_first_name_field input', data.firstName)
  await enterFieldData(addressRef, '._shipping_last_name_field  input', data.lastName)
  await enterFieldData(addressRef, '._shipping_address_1_field input', data.address)
  await enterFieldData(addressRef, '._shipping_city_field  input', data.city)
  await enterFieldData(addressRef, '._shipping_postcode_field input', data.postCode)
}

const addInvoiceAddress = async (data) => {
  document.querySelectorAll('.order_data_column h3 .edit_address')[0].click()
  await asyncSleep(2000)
  const addressRef = document.querySelectorAll('div.edit_address')[0]
  await invoiceAddressDetails(addressRef, data)
  await enterFieldData(addressRef, '._billing_email_field input', data.email)
  await selectPaymentMethod(addressRef)
  await selectBillingState(data?.state)
}

const addShippingAddress = async (data) => {
  document.querySelectorAll('.order_data_column h3 .edit_address')[1].click()
  await asyncSleep(2000)
  const addressRef = document.querySelectorAll('div.edit_address')[1]
  await shippingAddressDetails(addressRef, data)
  await selectShippingState(data?.state)
}

const clickPlaceOrderButton = async (data) => {
  document.querySelector('button.save_order ').click()
}

const selectPaymentMethod = async (addressRef) => {
  const paymentMethodDropdown = addressRef.querySelector('#_payment_method')

  if (paymentMethodDropdown) {
    paymentMethodDropdown.value = 'other'
    paymentMethodDropdown.dispatchEvent(new Event('change', { bubbles: true }))
  }
}
const selectMarketplace = async () => {
  await asyncSleep(3000)
  const marketplaceDropdown = document.querySelector('#select2-metakeyselect-container')
  await clickUsingPosition(marketplaceDropdown)
  await asyncSleep(3000)
  const amazonOption = findElementWithText('#select2-metakeyselect-results li', 'amazon_order_id')
  await clickUsingPosition(amazonOption)
}

const selectBillingState = async (billingState) => {
  await asyncSleep(3000)

  const stateDropDown = document.querySelector('#select2-_billing_state-container')
  await clickUsingPosition(stateDropDown)

  await asyncSleep(3000)
  const amazonOption = findElementWithText('#select2-_billing_state-results li', billingState)
  await clickUsingPosition(amazonOption)
}

const selectShippingState = async (shippingState) => {
  await asyncSleep(3000)

  const stateDropDown = document.querySelector('#select2-_shipping_state-container')
  await clickUsingPosition(stateDropDown)
  await asyncSleep(3000)
  const amazonOption = findElementWithText('#select2-_shipping_state-results li', shippingState)
  await clickUsingPosition(amazonOption)
}

const selectStatus = async () => {
  const statusDropdown = document.querySelector('#select2-order_status-container')
  await clickUsingPosition(statusDropdown)
  await asyncSleep(1500)
  const inProgressOption = findElementWithText('#select2-order_status-results li', 'In Bearbeitung')
  await clickUsingPosition(inProgressOption)
}
const addItems = async (data) => {
  findElementWithText("button[type='button']", 'Bestellposition(en) hinzufügen').click()
  await asyncSleep(1500)

  findElementWithText("button[type='button']", 'Produkt(e) hinzufügen').click()
  await asyncSleep(1500)

  findElementWithText(
    "span[class='select2-selection__placeholder']",
    'Nach einem Produkt suchen…',
  ).dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
  await asyncSleep(1500)

  const searchField = document.querySelector('.select2-search.select2-search--dropdown')
  searchField.click()
  writeTextToRef(searchField, data.itemTitle)

  await waitTillRefDisappear('.select2-results__option.loading-results')
  await asyncSleep(500)
  const firstResult = document.querySelector('ul.select2-results__options li')

  if (firstResult.innerText.toLowerCase() == 'keine übereinstimmung gefunden') {
    window.alert('Product not found in lieblingsflair store')
    return
  }
  await clickUsingPosition(firstResult)
  findElementWithText("button[id='btn-ok']", 'Hinzufügen').click()
}
export default placeOrder
