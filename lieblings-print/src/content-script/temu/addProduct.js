import { ADD_PRODUCT } from '../../common/const'
import {
  asyncSleep,
  browserRef,
  findElementWithIncludeText,
  findElementWithText,
  getNodeIndex,
  sanitizeValues,
  uploadImage,
  writeTextToRef,
} from '../../common/utils'

const COLOR_VARIANT = 'Weiß'
const DEFAULT_CUP_WEIGHT_GRAMS = 330

browserRef.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
  if (msg.action === ADD_PRODUCT.ENTER_INITIAL_DETAILS) {
    await addInitialDetails(msg.itemData)
    sendResponse({})
  }
  if (msg.action === ADD_PRODUCT.CLICK_ON_NEXT_BUTTON) {
    await clickNextButton()
    await asyncSleep(10000)
    sendResponse({})
  }
  if (msg.action === ADD_PRODUCT.ENTER_REMAINING_DETAILS) {
    await addRemainingDetails(msg.itemData)
    sendResponse({})
  }
  return true
})

const addInitialDetails = async (itemData) => {
  await asyncSleep(2000)
  await writeTitle(itemData)
  await selectCategory()
}

export const addRemainingDetails = async (itemData) => {
  // Step 1
  await asyncSleep(1000)
  await clickOnBrandButton()
  await addProductDescription(itemData)
  await clickNextButton()
  // Step 2
  await selectMaterial()
  await clickNextButton()
  // Step 2
  await selectColorVariation()
  await addProductDetails(itemData)
  await clickNextButton()
  await asyncSleep(2000)
  // Step 3
  await selectHandlingTime()
  await clickNextButton()
  await asyncSleep(2000)
  //step 4
  await addProductIdentification(itemData)
  await selectCountryOfOrigin()
  await selectManufaturarTime()
  await asyncSleep(2000)
  await uncheckOtherMarketplaces()
  await clickSubmitButton()
  await asyncSleep(5000)
}

const uncheckOtherMarketplaces = async () => {
  const marketplaceCheckRef = findElementWithText(
    '[class^="replicateCheckboxWrapper"]',
    'Sync to 24 marketplace(s)',
  )
  const checked = marketplaceCheckRef.querySelector('label').getAttribute('data-checked')
  if (checked === 'true') {
    marketplaceCheckRef.querySelector('input').click()
    await asyncSleep(1000)
  }
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
  await asyncSleep(1500)
}

const addProductIdentification = async (itemData) => {
  const productIdentificationRef = findElementWithText(
    '[data-testid="beast-core-grid-col-wrapper"]',
    '*Product Identification',
  ).parentElement.querySelector('input')
  productIdentificationRef.click()
  await asyncSleep(500)
  writeTextToRef(productIdentificationRef, itemData.legacyItemId)
  await asyncSleep(500)
  productIdentificationRef.dispatchEvent(
    new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }),
  )
  await asyncSleep(500)
}
const selectCountryOfOrigin = async () => {
  const countryOfOriginRef = findElementWithText(
    '[data-testid="beast-core-grid-col-wrapper"]',
    '*Country/Region of Origin',
  ).parentElement.parentElement.querySelector('[data-testid="beast-core-select-htmlInput"]')

  countryOfOriginRef.click()
  await asyncSleep(2000)
  findElementWithText('[class^="countryTag"]', 'Germany').click()
  await asyncSleep(1000)
}
const addProductDetails = async (itemData) => {
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
    itemData.estimatedAvailabilities[0].estimatedAvailableQuantity,
  )
  await addWeight(itemData, variantDetailsRef)
  await addDimensions(itemData, variantDetailsRef)

  const basePriceIndex = getNodeIndex(findElementWithIncludeText('thead th', 'Base price'))
  const basePriceRef = variantDetailsRef[basePriceIndex].querySelector('input')

  await asyncSleep(1000)
  writeTextToRef(basePriceRef, itemData.price.convertedFromValue)
  basePriceRef.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
  await asyncSleep(1000)
  const recommendedRetailPriceIndex = getNodeIndex(
    findElementWithText('thead th', 'Recommended retail price'),
  )
  const recommendedRetailPriceRef =
    variantDetailsRef[recommendedRetailPriceIndex].querySelector('input')
  recommendedRetailPriceRef.click()
  await asyncSleep(1000)
  writeTextToRef(recommendedRetailPriceRef, itemData.price.convertedFromValue)
  await asyncSleep(1000)
  const imagesIndex = getNodeIndex(findElementWithText('thead th', 'Images'))
  await uploadImages(itemData, variantDetailsRef[imagesIndex])
}

const addWeight = async (itemData, variantDetailsRef) => {
  const packageWeightIndex = getNodeIndex(findElementWithText('thead th', 'Package weight'))
  const packageWeightRef = variantDetailsRef[packageWeightIndex].querySelector('input')
  await fillLocalizedData(itemData, 'Gewicht', packageWeightRef, DEFAULT_CUP_WEIGHT_GRAMS, 1000)
}

const fillLocalizedData = async (itemData, aspectName, elementRef, defaultValue, unit) => {
  const localData = itemData.localizedAspects
  const aspectValueRef = localData.find((aspect) => aspect.name === aspectName)
  elementRef.click()
  await asyncSleep(300)
  const aspectValue = aspectValueRef?.value

  const value = Number(sanitizeValues(aspectValue))
  await asyncSleep(500)
  writeTextToRef(elementRef, value ? value * unit : defaultValue)
}
const addDimensions = async (itemData, variantDetailsRef) => {
  const packageDimensionIndex = getNodeIndex(findElementWithText('thead th', 'Package dimension'))

  const dimensionsDialogRef = variantDetailsRef[packageDimensionIndex].querySelector(
    '[data-testid="beast-core-grid-col-wrapper"]',
  )
  dimensionsDialogRef.click()
  await asyncSleep(2000)

  const lengthRef = document.querySelector('input[placeholder="Longest side"]')
  await fillLocalizedData(itemData, 'Länge', lengthRef, 8, 1)

  const widthRef = document.querySelector('input[placeholder="Second longest side"]')
  await fillLocalizedData(itemData, 'Durchmesser', widthRef, 8, 1)

  const heightRef = document.querySelector('input[placeholder="Shortest side"]')
  await fillLocalizedData(itemData, 'Höhe', heightRef, 10, 1)

  dimensionsDialogRef.click()
  await asyncSleep(1000)
}

const uploadImages = async (itemData, imageCellRef) => {
  imageCellRef.querySelector("[class^='imgsPopBtn']").click()
  await asyncSleep(2000)
  const toAddImagesRef = Array.from(
    document.querySelectorAll('[data-testid="beast-core-upload"] input'),
  )
  let allImages = [itemData?.image, ...(itemData?.additionalImages || [])].filter(Boolean)
  if (allImages.length > 10) {
    allImages = allImages.slice(0, 10)
  }

  await uploadImage(allImages, toAddImagesRef[0])

  await asyncSleep(10000)
  const allAddedImages = Array.from(
    document.querySelectorAll("[class^='imageList'] [class^='editItem']"),
  )
  for (let imageIndex = 0; imageIndex < allAddedImages.length; imageIndex++) {
    await clickSaveOnImageButton(imageIndex === allAddedImages.length - 1)
    await asyncSleep(5000)
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
const writeTitle = async (itemData) => {
  const productTitleRef = document.querySelector("[placeholder='Please enter a product name']")
  writeTextToRef(productTitleRef, itemData.title)
  await asyncSleep(1000)
}
const clickOnBrandButton = async () => {
  await asyncSleep(1000)

  findElementWithText('[data-testid="beast-core-checkbox"]', 'This product does not have a brand')
    .querySelector('input')
    .click()
  await asyncSleep(1000)
}

const addProductDescription = async (itemData) => {
  const descriptionRef = document.querySelector(
    "[placeholder='Please enter a product description']",
  )
  descriptionRef.click()
  await asyncSleep(500)
  writeTextToRef(descriptionRef, itemData.shortDescription)
  await asyncSleep(500)
}

const clickNextButton = async () => {
  const nextBtn = findElementWithText("[role='button'] div", 'Next')
  nextBtn?.click()
  await asyncSleep(4000)
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

const clickSaveOnImageButton = async (isLast) => {
  const nextBtn = findElementWithText(
    "[class^='bottomArea'] [role='button']",
    isLast ? 'Save' : 'Next',
  )
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
  categoryTextFieldRef.click()
  await asyncSleep(1500)
  writeTextToRef(categoryTextFieldRef, categoryOption)
  await asyncSleep(1500)
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
