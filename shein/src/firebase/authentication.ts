import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { initQuota } from './apis'
import { auth } from './apps'

const signUpUser = async (name: string, email: string, password: string) => {
  try {
    const response = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(response.user, { displayName: name })
    await sendEmailVerification(response.user)
    await initQuota(email)
    await signOut(auth)
    return {
      success: true,
      data: response.user,
      message: 'Successful, verify email from inbox',
    }
  } catch (err: any) {
    return {
      success: false,
      message: err.message,
      code: err.code,
    }
  }
}

const signInUser = async (email: string, password: string, onlyVerifiedEmails = false) => {
  try {
    const response = await signInWithEmailAndPassword(auth, email, password)

    if (onlyVerifiedEmails && !response.user.emailVerified) {
      await signOut(auth)
      return {
        success: false,
        data: response.user,
        message: 'Verify your email!',
      }
    }
    return {
      success: true,
      data: response.user,
      message: 'Successful!',
    }
  } catch (err: any) {
    return {
      success: false,
      message: err.message,
      code: err.code,
    }
  }
}

const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider()
  const result = await signInWithPopup(auth, provider)
  return result.user
}
const signOutUser = async () => await signOut(auth)
export { signUpUser, signInUser, signInWithGoogle, signOutUser }
