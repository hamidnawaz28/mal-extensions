
function asyncSleep(sec: any) {
  return new Promise((resolve) => setTimeout(resolve, sec * 1000))
}


const getItemId = (url: string) => {
  const regex = /marketplace\/item\/(\d+)\//;
  const match = url.match(regex);

  if (match) {
    return match[1];
  }
  return ''
}
const getTextContent = (selectorText: string) => document?.querySelector(`i[style*='${selectorText}']`)?.parentElement?.parentElement?.querySelector("div:nth-child(2)")?.textContent
const findElementWithInnerText = (text: string, elementType: string = 'span') => {
  const elements = Array.from(document.querySelectorAll(`${elementType}`)) as HTMLElement[]
  return elements?.find((el: any) => el.innerText == text)
}
export { asyncSleep, getItemId, getTextContent, findElementWithInnerText }
