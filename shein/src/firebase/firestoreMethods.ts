import { collection, doc, getDoc, getDocs, query, setDoc, where, updateDoc } from 'firebase/firestore'
import { firestore } from './apps'
import { FIREBASE_COLLECTIONS } from '../common/constants'

const addADoc = async (collection: string, documentId: string, data: any) => {
  await setDoc(doc(firestore, collection, documentId), data)
  return documentId
}

const editADoc = async (collection: string, documentId: string, data: any) => {
  const prevData = await getADoc(collection, documentId)
  await setDoc(doc(firestore, collection, documentId), { ...prevData.data, ...data })
}

const getADoc = async (collection: string, documentId: string) => {
  const docSnap = await getDoc(doc(firestore, collection, documentId))
  if (docSnap.exists()) {
    return { success: true, data: docSnap.data() }
  } else {
    return { success: false, data: {}, message: 'missing data!' }
  }
}



const getUserData = async (key: string, value: string) => {
  const usersRef = collection(firestore, FIREBASE_COLLECTIONS.user)
  const q = query(usersRef, where(key, '==', value))
  const querySnapshot = await getDocs(q)
  const resp: any = []
  querySnapshot.forEach((doc: any) => {
    resp.push(doc.data())
  })
  return resp
}

const updateData = async (key: string, value: string, data: any) => {
  const usersRef = collection(firestore, FIREBASE_COLLECTIONS.user)
  const q = query(usersRef, where(key, '==', value))
  const querySnapshot = await getDocs(q)

  querySnapshot.forEach(async (doc: any) => {
    await editADoc(FIREBASE_COLLECTIONS.user, doc.id, {
      ...data
    })
  })

}

export { addADoc, editADoc, getADoc, getUserData, updateData }

