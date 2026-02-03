import { ADD_PRODUCT, ITEM_DESCRIPTION, ITEM_DETAILS } from '../../common/const'
import {
  asyncSleep,
  browserRef,
  findElementWithIncludeText,
  findElementWithText,
  getNodeIndex,
  sanitizeValues,
  uploadImages,
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
  await writeTitle(itemData.title)
  await selectCategory()
}

export const addRemainingDetails = async (itemData) => {
  console.log('itemData----', itemData)

  // Step 1
  await asyncSleep(1000)
  await clickOnBrandButton()
  await addProductDescription(itemData)
  const imagesRef = findElementWithText(
    'div[data-testid]',
    'Detailbilder',
  ).parentElement.querySelector('input')
  await dropDownSelect('Artikelsteuercode (ITC)', 'GEN STANDARD')
  await addDescriptionBullets(itemData)
  await addItemImages(itemData, imagesRef)
  await asyncSleep(2000)
  await clickNextButton()

  // Step 2
  await asyncSleep(2000)
  await dropDownSelect('*Material', 'Keramik')
  await asyncSleep(2000)
  await selectContact()
  await clickNextButton()
  // Step 2
  await asyncSleep(2000)
  await selectColorVariation()
  await asyncSleep(2000)
  await addProductDetails(itemData)
  await clickNextButton()
  await asyncSleep(2000)
  // Step 3
  await selectHandlingTime()
  await asyncSleep(2000)
  await addProductSku(itemData)
  await clickNextButton()
  await asyncSleep(2000)
  //step 4

  await dropDownSelect('Wurden Produkte unter dieser', 'Produkte unter dieser Waren-ID wurden')
  await dropDownSelect('Etikett für Kontakt mit Lebensmitteln', 'Informationen nicht zutreffend')
  await dropDownSelect('Warnhinweis oder Sicherheitsinformationen', 'Produktdetailseite anzeigen')
  await selectManufaturar()
  await asyncSleep(2000)
  await addProductIdentification(itemData)
  await asyncSleep(2000)
  await selectCountryOfOrigin()
  await asyncSleep(2000)
  await selectResponsiblePerson()
  await asyncSleep(2000)
  await uncheckOtherMarketplaces()
  await asyncSleep(1000)
  await clickSubmitButton()
  // await asyncSleep(10000)
}

const addDescriptionBullets = async (itemData) => {
  const descriptionRows = ITEM_DETAILS
  for (let rowIndex = 0; rowIndex < descriptionRows.length; rowIndex++) {
    findElementWithIncludeText("div[role='button']", 'Aufzählungspunkt hinzufügen')?.click()
    await asyncSleep(1500)
    const row = descriptionRows[rowIndex]
    const descriptionBulletRef = document.querySelectorAll(
      "[placeholder='aufzählungspunkt eingeben']",
    )[rowIndex]
    descriptionBulletRef.click()
    await asyncSleep(500)
    writeTextToRef(descriptionBulletRef, row)
    await asyncSleep(500)
  }
}
const uncheckOtherMarketplaces = async () => {
  const marketplaceCheckRef = findElementWithIncludeText(
    '[class^="replicateCheckboxWrapper"]',
    'Marktplatz/-plätzen synchronisieren',
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
    '*Bearbeitungszeit',
  ).parentElement
  handlingTimeRef.querySelector('input').click()
  await asyncSleep(1000)
  findElementWithText('ul[role="listbox"] li', '2 Werktage').click()
  await asyncSleep(1000)
}

const addProductSku = async (itemData) => {
  const handlingTimeRef = findElementWithText(
    '[data-testid="beast-core-grid-col-wrapper"]',
    'Beitragswaren',
  ).parentElement
  const inputRef = handlingTimeRef.querySelector('input')
  inputRef.click()
  await asyncSleep(1000)
  await fillLocalizedDataSKU(itemData, 'Herstellernummer', inputRef)
  await asyncSleep(1000)
}
const selectManufaturar = async () => {
  const manufaturarRef = findElementWithIncludeText(
    '[data-testid="beast-core-grid-col-wrapper"]',
    'Hersteller',
  ).parentElement
  const manufacturarInput = manufaturarRef.querySelector('input[placeholder="Auswählen"]')
  manufacturarInput.click()
  await asyncSleep(1500)
  manufacturarInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
  await asyncSleep(1500)
}

const selectResponsiblePerson = async () => {
  const responsiblePersonRef = findElementWithIncludeText(
    '[data-testid="beast-core-grid-col-wrapper"]',
    'EU-Verantwortlicher',
  ).parentElement
  const responsiblePersonInput = responsiblePersonRef.querySelector(
    ':scope input[placeholder="Auswählen"]',
  )
  responsiblePersonInput.click()
  await asyncSleep(2000)
  responsiblePersonInput.dispatchEvent(
    new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }),
  )
  await asyncSleep(2000)
}

const addProductIdentification = async (itemData) => {
  const productIdentificationRef = findElementWithIncludeText(
    '[data-testid="beast-core-grid-col-wrapper"]',
    'Produktidentifikation',
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
  const countryOfOriginRef = findElementWithIncludeText(
    '[data-testid="beast-core-grid-col-wrapper"]',
    'Ursprungsland/-region',
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
    findElementWithText('thead th', 'Verkäufer-Auftragserfüllungsmenge'),
  )
  const sellerFullfillmentQuatityRef =
    variantDetailsRef[sellerFullfillmentQuatityIndex].querySelector('input')
  writeTextToRef(sellerFullfillmentQuatityRef, 1000)
  await addWeight(itemData, variantDetailsRef)
  await asyncSleep(1000)
  await addDimensions(itemData, variantDetailsRef)
  await asyncSleep(1000)
  const basePriceIndex = getNodeIndex(
    findElementWithIncludeText('thead th', 'Basispreis direkt festlegen'),
  )
  const basePriceRef = variantDetailsRef[basePriceIndex].querySelector('input')
  await asyncSleep(1000)
  writeTextToRef(basePriceRef, '12.95')
  basePriceRef.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
  await asyncSleep(1000)
  const recommendedRetailPriceIndex = getNodeIndex(
    findElementWithText('thead th', 'Unverbindliche Preisempfehlung'),
  )
  const recommendedRetailPriceRef =
    variantDetailsRef[recommendedRetailPriceIndex].querySelector('input')
  recommendedRetailPriceRef.click()
  await asyncSleep(1000)
  writeTextToRef(recommendedRetailPriceRef, '12.95')
  await asyncSleep(1000)

  const addLinkIndex = getNodeIndex(findElementWithText('thead th', 'Referenzlink'))
  const addLinkRef = variantDetailsRef[addLinkIndex]
  addLinkRef.querySelector('[class^="addBtn"]').click()
  await asyncSleep(2000)
  const linkInputRef = document.querySelector("[class^='provideUrl2PriceModalTextArea'] textarea")
  writeTextToRef(linkInputRef, `https://www.ebay.com/itm/${itemData.legacyItemId}`)
  await asyncSleep(2000)
  await clickSaveButton()
  await asyncSleep(1000)

  const imagesIndex = getNodeIndex(findElementWithText('thead th', 'Bilder'))

  variantDetailsRef[imagesIndex].querySelector("[class^='imgsPopBtn']").click()
  await asyncSleep(3000)
  const toAddImagesRef = Array.from(
    document.querySelectorAll('[data-testid="beast-core-upload"] input'),
  )
  await addItemImages(itemData, toAddImagesRef[0])
  await asyncSleep(3000)
}

const addWeight = async (itemData, variantDetailsRef) => {
  const packageWeightIndex = getNodeIndex(findElementWithText('thead th', 'Gewicht des Pakets'))
  const packageWeightRef = variantDetailsRef[packageWeightIndex].querySelector('input')
  await fillLocalizedData(itemData, 'Gewicht', packageWeightRef, DEFAULT_CUP_WEIGHT_GRAMS, 1000)
}

const fillLocalizedData = async (itemData, aspectName, elementRef, defaultValue, unit) => {
  const localData = itemData.localizedAspects
  const aspectValueRef = localData.find((aspect) => aspect.name === aspectName)
  elementRef.click()
  await asyncSleep(500)
  const aspectValue = aspectValueRef?.value

  const value = Number(sanitizeValues(aspectValue))
  writeTextToRef(elementRef, value ? value * unit : defaultValue)
  await asyncSleep(500)
}
const fillLocalizedDataSKU = async (itemData, aspectName, elementRef) => {
  const localData = itemData.localizedAspects
  const aspectValueRef = localData.find((aspect) => aspect.name === aspectName)
  elementRef.click()
  await asyncSleep(500)
  const aspectValue = aspectValueRef?.value

  writeTextToRef(elementRef, aspectValue ? aspectValue : '')
  await asyncSleep(500)
}

const addDimensions = async (itemData, variantDetailsRef) => {
  const packageDimensionIndex = getNodeIndex(findElementWithText('thead th', 'Verpackungsmaße'))

  const dimensionsDialogRef = variantDetailsRef[packageDimensionIndex].querySelector(
    '[data-testid="beast-core-grid-col-wrapper"]',
  )
  dimensionsDialogRef.click()
  await asyncSleep(2000)

  const lengthRef = document.querySelector('input[placeholder="Längste Seite"]')
  await fillLocalizedData(itemData, 'Länge', lengthRef, 8, 1)

  const widthRef = document.querySelector('input[placeholder="Zweitlängste Seite"]')
  await fillLocalizedData(itemData, 'Durchmesser', widthRef, 8, 1)

  const heightRef = document.querySelector('input[placeholder="Kürzeste Seite"]')
  await fillLocalizedData(itemData, 'Höhe', heightRef, 10, 1)

  dimensionsDialogRef.click()
  await asyncSleep(1000)
}

const addItemImages = async (itemData, imageRef) => {
  await asyncSleep(3000)

  let allImages = [itemData?.image, ...(itemData?.additionalImages || [])].filter(Boolean)
  if (allImages.length > 10) {
    allImages = allImages.slice(0, 10)
  }

  await uploadImages(allImages, imageRef)
  await asyncSleep(10000)
  const allAddedImages = Array.from(
    document.querySelectorAll("[class^='imageList'] [class^='editItem']"),
  )
  for (let imageIndex = 0; imageIndex < allAddedImages.length; imageIndex++) {
    await clickSaveOnImageButton(imageIndex === allAddedImages.length - 1)
    await asyncSleep(5000)
  }
  await clickSaveButton()
  await asyncSleep(3000)
}

const selectColorVariation = async () => {
  findElementWithText('label div', 'Farbe').parentElement.querySelector('input').click()
  const colorSelectRef = findElementWithText(
    '[data-testid="beast-core-grid-col-wrapper"]',
    'Farbe',
  ).parentElement
  const colorSelect = colorSelectRef.querySelector('input')
  await asyncSleep(1000)
  writeTextToRef(colorSelect, COLOR_VARIANT)
  await asyncSleep(500)
  colorSelectRef.querySelector('[role="button"]').click()
  await asyncSleep(1000)
}

const dropDownSelect = async (label, optionText) => {
  const inputRef = findElementWithIncludeText(
    '[data-testid="beast-core-grid-col-wrapper"]',
    label,
  ).parentElement.querySelector('input')
  inputRef.click()
  await asyncSleep(1000)
  findElementWithIncludeText('ul li div', optionText).click()
  await asyncSleep(1000)
}

const selectContact = async () => {
  const materialElement = findElementWithText(
    '[data-testid="beast-core-grid-col-wrapper"]',
    '*Lippen- und Felgenkontakt',
  ).parentElement.querySelector('input')
  materialElement.click()
  await asyncSleep(1000)
  findElementWithText('ul li div', 'Nein').click()
  await asyncSleep(1000)
}
const writeTitle = async (title) => {
  const productTitleRef = document.querySelector(
    "[placeholder='Bitte geben Sie einen Produktnamen ein']",
  )
  writeTextToRef(productTitleRef, title)
  await asyncSleep(1000)
}
const clickOnBrandButton = async () => {
  await asyncSleep(1000)

  findElementWithText('[data-testid="beast-core-checkbox"]', 'Dieses Produkt hat keine Marke')
    .querySelector('input')
    .click()
  await asyncSleep(1000)
}

const addProductDescription = async (itemData) => {
  const descriptionRef = document.querySelector(
    "[placeholder='Bitte geben Sie eine Produktbeschreibung ein']",
  )
  descriptionRef.click()
  await asyncSleep(500)
  writeTextToRef(descriptionRef, ITEM_DESCRIPTION)
  await asyncSleep(500)
}

const clickNextButton = async () => {
  const nextBtn = findElementWithText("[role='button'] div", 'Weiter')
  nextBtn?.click()
  await asyncSleep(7000)
}
const clickSubmitButton = async () => {
  const nextBtn = findElementWithText("[role='button'] div", 'Absenden')
  nextBtn?.click()
  await asyncSleep(1000)
  nextBtn?.click()
  await asyncSleep(1000)
}

const clickSaveOnImageButton = async (isLast) => {
  const nextBtn = findElementWithText(
    "[class^='bottomArea'] [role='button']",
    isLast ? 'Speichern' : 'Weiter',
  )
  nextBtn?.click()
  await asyncSleep(1000)
}
const clickSaveButton = async () => {
  const nextBtn = findElementWithText("[role='button'] div", 'Speichern')
  nextBtn?.click()
  await asyncSleep(1000)
}
const selectCategory = async () => {
  const categoryOption =
    'Haus und Küche / Küche & Esszimmer / Essen & Unterhaltung / Glas- & Trinkwaren / Becher, Tassen & Untertassen / Kaffeetassen & -becher'
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
