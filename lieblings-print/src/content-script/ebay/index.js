import Browser from 'webextension-polyfill'
import { asyncSleep } from '../../common/utils'

async function keepAddingButtons() {
  console.log('-----ebay')
  await asyncSleep(3000)
  const logoRef = document.querySelector('.str-seller-card__store-name')

  const authButton = buttonInstance('Get Auth', 'get-auth')
  authButton.addEventListener('click', () => {
    Browser.runtime.sendMessage({
      action: 'OPEN_OAUTH',
    })
  })
  logoRef.appendChild(authButton)

  setInterval(async () => {
    const items = document.querySelectorAll('ul li[data-listingid]')

    items.forEach((item) => {
      const uploadButton = item.querySelector('#upload-to-temu')

      const btn = buttonInstance('Upload on Temu', 'upload-to-temu')
      btn.addEventListener('click', () => {
        const itemId = item.dataset.listingid
        console.log('Button clicked for:', itemId)
      })
      if (!uploadButton) {
        item.appendChild(btn)
      }
    })
  }, 1000)
}

const buttonInstance = (title, id) => {
  const btn = document.createElement('button')
  btn.innerText = title
  btn.id = id
  btn.style.padding = '10px 16px'
  btn.style.border = 'none'
  btn.style.borderRadius = '8px'
  btn.style.cursor = 'pointer'
  btn.style.fontSize = '14px'
  btn.style.fontWeight = '600'
  btn.style.color = '#fff'
  btn.style.background = 'linear-gradient(135deg, #FF6A00, #EE0979)'
  btn.style.boxShadow = '0 4px 10px rgba(0,0,0,0.15)'
  btn.style.transition = 'all 0.25s ease'
  btn.style.marginLeft = '10px'
  btn.style.display = 'inline-block'

  btn.onmouseenter = () => {
    btn.style.transform = 'scale(1.06)'
    btn.style.boxShadow = '0 6px 16px rgba(0,0,0,0.25)'
  }

  btn.onmouseleave = () => {
    btn.style.transform = 'scale(1)'
    btn.style.boxShadow = '0 4px 10px rgba(0,0,0,0.15)'
  }
  return btn
}

keepAddingButtons()
