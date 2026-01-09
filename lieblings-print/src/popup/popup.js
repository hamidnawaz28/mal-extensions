import { buttonInstance, divInstance, inputInstance } from '../common/utils'
import { addAnItemId } from '../firebase/apis'

const popup = () => {
  const rootRef = document.querySelector('#root')
  const alert = divInstance(
    'alert',
    {},
    'When you create a new account make sure you add a Hersteller and EU-Verantwortlicher, otherwise it will fail',
  )
  rootRef.appendChild(alert)

  const itemIdInput = inputInstance('Added an item Id', 'item-id')
  const itemIdButtonRef = buttonInstance('Added ID', 'item-id-button')
  itemIdButtonRef.onclick = () => {
    addAnItemId(document.querySelector('#item-id').value, {})
  }
  rootRef.appendChild(itemIdInput)
  rootRef.appendChild(itemIdButtonRef)
}
popup()
