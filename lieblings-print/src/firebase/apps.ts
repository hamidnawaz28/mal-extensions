import { getApp, getApps, initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { FIREBASE_INIT } from '../common/const'

const app = getApps().length ? getApp() : initializeApp(FIREBASE_INIT)

const firestore = getFirestore(app)
export { firestore }
