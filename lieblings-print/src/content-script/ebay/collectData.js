import { findElementWithText } from '../../common/utilsMethods'

export const collectData = () => {
  const data = {}
  data.title = document.querySelector('.x-item-title__mainTitle').innerText
  data.price = document
    .querySelector('.x-price-primary')
    .innerText.replace('£', '')
    .replace(',', '')
    .trim()

  data.images = Array.from(
    document.querySelectorAll('.ux-image-carousel-item.image-treatment.image img'),
  )
    .map((el) => el.src)
    .filter((el) => el != '')

  data.length = getMetaData('length')?.replace('mm', '') ?? undefined
  data.width = getMetaData('width')?.replace('mm', '') ?? undefined
  data.height = getMetaData('height')?.replace('mm', '') ?? undefined
  data.capacity = getMetaData('capacity')?.replace('mm', '') ?? undefined
  return data
}

const getMetaData = (title) => {
  return findElementWithText(
    '[data-testid="x-about-this-item"] dt',
    title,
  )?.parentElement?.querySelector('dd')?.innerText
}
