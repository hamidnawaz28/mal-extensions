import { getApp, getApps, initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { FIREBASE_INIT } from '../common/constants'

const app = () => {
  if (getApps().length === 0) {
    return initializeApp(FIREBASE_INIT)
  } else {
    getApp()
  }
}

app()

const firestore = getFirestore()
const auth = getAuth()

export { firestore, auth }

export default app
