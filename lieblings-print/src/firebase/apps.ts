import { getApp, getApps, initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { FIREBASE_INIT } from '../common/const'

const app = () => {
  if (getApps().length === 0) {
    return initializeApp(FIREBASE_INIT)
  } else {
    getApp()
  }
}

const firestore = getFirestore()
const auth = getAuth()

export { firestore, auth, app }
