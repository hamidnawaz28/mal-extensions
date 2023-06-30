import { getApp, getApps, initializeApp } from 'firebase/app'
import { FIREBASE_CREDS } from '../common/constants'

const app = getApps().length === 0 ? initializeApp(FIREBASE_CREDS) : getApp()

export default app
