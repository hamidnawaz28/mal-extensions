// import Browser from 'webextension-polyfill';
// Browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.action === 'getAds') {
//     const ads = extractAdData();
//     sendResponse({ success: true, ads });
//   }
//   return true;
// });

export const findElementContainingText = (ref, element, text) => {
  return [...ref.querySelectorAll(element)].find((span) => span.textContent.includes(text))
}

export const waitTill = async (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export async function waitForElement(mainGridSelector, maxRetries = 50, interval = 2000) {
  const retries = 0
  const foundElement = false

  while (foundElement === false && retries < maxRetries) {
    const mainDiv = await mainGridSelector()

    if (mainDiv) return mainDiv
    await new Promise((res) => setTimeout(res, interval))
  }
  throw new Error('Element not found: ')
}
