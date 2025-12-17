import { divInstance } from '../common/utils'

const popup = () => {
  const rootRef = document.querySelector('#root')
  const alert = divInstance(
    'alert',
    {},
    'When you create a new account make sure you add a Hersteller and EU-Verantwortlicher, otherwise it will fail',
  )
  rootRef.appendChild(alert)
}
popup()
