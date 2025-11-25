import { updateActiveTabUrl, waitTillActiveTabLoads } from '../../common/browserMethods'
import {
  asyncSleep,
  findElementWithText,
  getNodeIndex,
  removeCm,
  uploadImage,
  writeTextToRef,
} from '../../common/utils'
import { DUMMY_DATA } from '../ebay/dummyData'

const COLOR_VARIANT = 'Weib'

export const temuScript = async () => {
  const addNewProductUrl = 'https://seller-eu.temu.com/goods-category.html'
  await updateActiveTabUrl(addNewProductUrl)
  // Init step
  await asyncSleep(2000)
  await writeTitle()
  await selectCategory()
  await clickNextButton()
  await waitTillActiveTabLoads()
  clickOnBrandButton()
  // Step 1
  await addProductDescriptoion()
  await clickNextButton()
  // Step 2
  await selectMaterial()
  await clickNextButton()
  // Step 2
  await selectColorVariation()
  await addProductDetails()
  await clickNextButton()
  await asyncSleep(2000)
  // Step 3
  await selectHandlingTime()
  await clickNextButton()
  await asyncSleep(2000)
  //step 4
  await selectManufaturarTime()
  await selectCountryOfOrigin()
  await addProductIdentification()
  await clickSubmitButton()
  await asyncSleep(4000)
  await clickCancelButton()
}

const selectHandlingTime = async () => {
  const handlingTimeRef = findElementWithText(
    '[data-testid="beast-core-grid-col-wrapper"]',
    '*Handling time',
  ).parentElement
  handlingTimeRef.querySelector('input').click()
  await asyncSleep(1000)
  findElementWithText('ul[role="listbox"] li', '2').click()
  await asyncSleep(1000)
}

const selectManufaturarTime = async () => {
  const manufaturarRef = findElementWithText(
    '[data-testid="beast-core-grid-col-wrapper"]',
    '*Manufacturer',
  ).parentElement
  manufaturarRef.querySelector('input[placeholder="Select"]').click()
  await asyncSleep(2000)
  document.querySelector('ul[role="listbox"] li').click()
  await asyncSleep(1000)
}

const addProductIdentification = async () => {
  const productIdentificationRef = findElementWithText(
    '[data-testid="beast-core-grid-col-wrapper"]',
    '*Product Identification',
  ).parentElement.querySelector('input')
  productIdentificationRef.click()
  await asyncSleep(1000)
  writeTextToRef(productIdentificationRef, DUMMY_DATA.itemId)
  await asyncSleep(1000)
}
const selectCountryOfOrigin = async () => {
  const countryOfOriginRef = findElementWithText(
    '[class^="fieldLabel"]',
    'Country/Region of Origin',
  ).parentElement.querySelector('input')
  countryOfOriginRef.click()
  await asyncSleep(1000)
  findElementWithText('[class^="countryTag"]', 'Germany').click()
  await asyncSleep(1000)
}
const addProductDetails = async () => {
  const variantDetailsRef = findElementWithText(
    '[data-testid="beast-core-table-body-tr"] td',
    COLOR_VARIANT,
  ).parentElement.querySelectorAll('td')

  const sellerFullfillmentQuatityIndex = getNodeIndex(
    findElementWithText('thead th', 'Seller fulfillment quantity'),
  )
  const sellerFullfillmentQuatityRef =
    variantDetailsRef[sellerFullfillmentQuatityIndex].querySelector('input')
  writeTextToRef(
    sellerFullfillmentQuatityRef,
    DUMMY_DATA.estimatedAvailabilities[0].estimatedAvailableQuantity,
  )
  await addWeight(variantDetailsRef)

  await addDimentions(variantDetailsRef)
  const imagesIndex = getNodeIndex(findElementWithText('thead th', 'Images'))
  await uploadImages(variantDetailsRef[imagesIndex])
  const basePriceIndex = getNodeIndex(findElementWithText('thead th', 'Base price'))
  const basePriceRef = variantDetailsRef[basePriceIndex].querySelector('input')
  writeTextToRef(basePriceRef, DUMMY_DATA.price.convertedFromValue)

  const recommendedRetailPriceIndex = getNodeIndex(
    findElementWithText('thead th', 'Recommended retail price'),
  )
  const recommendedRetailPriceRef =
    variantDetailsRef[recommendedRetailPriceIndex].querySelector('input')
  writeTextToRef(recommendedRetailPriceRef, DUMMY_DATA.price.convertedFromValue + 2)
}

const addWeight = async (variantDetailsRef) => {
  const packageWeightIndex = getNodeIndex(findElementWithText('thead th', 'Package weight'))
  const packageWeightRef = variantDetailsRef[packageWeightIndex].querySelector('input')
  const localData = DUMMY_DATA.localizedAspects
  const getWeightRef = localData.find((aspect) => aspect.name === 'Gewicht')
  if (getWeightRef) writeTextToRef(packageWeightRef, removeCm(getWeightRef.value))
}

const addDimentions = async (variantDetailsRef) => {
  const packageDimensionIndex = getNodeIndex(findElementWithText('thead th', 'Package dimension'))

  variantDetailsRef[packageDimensionIndex]
    .querySelectorAll('[data-testid="beast-core-grid-col-wrapper"]')
    .click()
  const localData = DUMMY_DATA.localizedAspects

  const lengthRef = document.querySelector('input[placeholder="Longest side"]')
  const getLengthRef = localData.find((aspect) => aspect.name === 'Höhe')
  if (getLengthRef) writeTextToRef(lengthRef, removeCm(getLengthRef.value))

  const widthRef = document.querySelector('input[placeholder="Second longest side"]')
  const getWidthRef = localData.find((aspect) => aspect.name === 'Durchmesser')
  if (getWidthRef) writeTextToRef(widthRef, removeCm(getWidthRef.value))

  const heightRef = document.querySelector('input[placeholder="Shortest side"]')
  const getHeightRef = localData.find((aspect) => aspect.name === 'Höhe')
  if (getHeightRef) writeTextToRef(heightRef, removeCm(getHeightRef.value))
}

const uploadImages = async (imageCellRef) => {
  let allImages = [DUMMY_DATA.image, ...DUMMY_DATA.additionalImages]
  imageCellRef.querySelector("[class^='imgsPopBtn']").click()
  await asyncSleep(2000)
  const toAddImagesRef = Array.from(document.querySelectorAll('[data-testid="beast-core-upload"]'))
  if (allImages.length > 10) {
    allImages = allImages.slice(0, 10)
  }
  for (let imageIndex = 0; imageIndex < allImages.length; imageIndex++) {
    const imageRef = allImages[imageIndex]
    await uploadImage(imageRef.imageUrl, toAddImagesRef[imageIndex])
    await asyncSleep(1000)
    await clickOkButton()
  }
  await clickSaveButton()
}

const selectColorVariation = async () => {
  findElementWithText('label div', 'Color').parentElement.querySelector('input').click()
  const colorSelectRef = findElementWithText(
    '[data-testid="beast-core-grid-col-wrapper"]',
    'Color',
  ).parentElement
  const colorSelect = colorSelectRef.querySelector('input')
  await asyncSleep(1000)
  writeTextToRef(colorSelect, COLOR_VARIANT)
  await asyncSleep(500)
  colorSelectRef.querySelector('[role="button"]').click()
  await asyncSleep(1000)
}

const selectMaterial = async () => {
  const materialElement = findElementWithText(
    "p[class^='itemTitle']",
    '*Material',
  ).parentElement.querySelector('input')
  materialElement.click()
  await asyncSleep(1000)
  findElementWithText('ul li div', 'Ceramic').click()
  await asyncSleep(1000)
}
const writeTitle = async () => {
  const productTitleRef = document.querySelector("[placeholder='Please enter a product name']")
  writeTextToRef(productTitleRef, DUMMY_DATA.title)
  await asyncSleep(1000)
}
const clickOnBrandButton = async () => {
  document.querySelector('[data-testid="beast-core-checkbox-checkIcon"]').click()
}

const addProductDescriptoion = async () => {
  const descriptionRef = document.querySelector(
    "[placeholder='Please enter a product description']",
  )
  writeTextToRef(descriptionRef, DUMMY_DATA.shortDescription)
  await asyncSleep(500)
}
const clickNextButton = async () => {
  const nextBtn = findElementWithText("[role='button'] div", 'Next')
  nextBtn?.click()
  await asyncSleep(1000)
}
const clickSubmitButton = async () => {
  const nextBtn = findElementWithText("[role='button'] div", 'Submit')
  nextBtn?.click()
  await asyncSleep(1000)
}
const clickCancelButton = async () => {
  const nextBtn = findElementWithText("[role='button'] div", 'Cancel')
  nextBtn?.click()
  await asyncSleep(1000)
}
//  603345645337547

const clickOkButton = async () => {
  const nextBtn = findElementWithText("[role='button'] div", 'Save')
  nextBtn?.click()
  await asyncSleep(1000)
}
const clickSaveButton = async () => {
  const nextBtn = findElementWithText("[role='button'] div", 'Save')
  nextBtn?.click()
  await asyncSleep(1000)
}
const selectCategory = async () => {
  const categoryOption =
    'Home & Kitchen / Kitchen & Dining / Dining & Entertaining / Glassware & Drinkware / Cups, Mugs, & Saucers / Coffee Cups & Mugs'
  const categoryTextFieldRef = document.querySelector(
    '[data-testid="beast-core-cascader-input"] [class^="IPT_input"] input',
  )
  writeTextToRef(categoryTextFieldRef, categoryOption)
  await asyncSleep(1000)
  let foundOption = false
  while (!foundOption) {
    await asyncSleep(500)
    const option = findElementWithText(
      "ul[data-testid='beast-core-cascader-searchDropdown-content-root'] div",
      categoryOption,
    )
    if (option) {
      foundOption = true
      option.click()
      await asyncSleep(500)
    }
  }
}
