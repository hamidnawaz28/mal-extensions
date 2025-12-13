import Browser from 'webextension-polyfill'

async function asyncSleep(sec: any) {
  return new Promise((resolve) => setTimeout(resolve, sec * 1000))
}

export const mactracLogo = () => Browser.runtime.getURL('assets/mactrac.png')
export const mactracDarkLogo = () => Browser.runtime.getURL('assets/mactrac_dark.png')
export const trashIcon = () => Browser.runtime.getURL('assets/trash.png')
export const caloriesIcon = () => Browser.runtime.getURL('assets/calories.svg')
export const cheeseIcon = () => Browser.runtime.getURL('assets/cheese.svg')
export const leafIcon = () => Browser.runtime.getURL('assets/leaf.svg')
export const muscleIcon = () => Browser.runtime.getURL('assets/muscle.svg')

const convertInThousands = (number: number) => (number / 1000).toFixed(2).replace(/\.00$/, '')
export const stringToNumber = (string: number | string) =>
  string == null || string === '' ? 0 : Number(string) || 0
export { asyncSleep, convertInThousands }
