// Add a new order button on lieblingsprint24 orders page
// https://lieblingsprint24.shop/wp-admin/admin.php?page=wc-orders&action=new

import { asyncSleep } from '../../common/utils'
import {
  findElementWithText,
  waitTillRefDisappear,
  writeTextToRef,
} from '../../common/utilsMethods'

const placeOrder = async (data) => {
  findElementWithText("button[type='button']", 'Bestellposition(en) hinzufügen').click()
  await asyncSleep(500)

  findElementWithText("button[type='button']", 'Produkt(e) hinzufügen').click()
  await asyncSleep(500)

  findElementWithText(
    "span[class='select2-selection__placeholder']",
    'Nach einem Produkt suchen…',
  ).click()
  const searchField = document.querySelector('.select2-search.select2-search--dropdown')
  searchField.click()
  writeTextToRef(searchField, data.itemTitle)
  const loading = document.querySelector('.select2-results__option.loading-results')
  await waitTillRefDisappear(loading)
}
export default placeOrder
