import { doc, getDoc, setDoc } from 'firebase/firestore'
import { firestore } from './apps'

const addADoc = async (collection: string, id: string, data: any) => {
  await setDoc(doc(firestore, collection, id), data)
  return id
}

const editADoc = async (collection: string, documentId: string, data: any) => {
  await setDoc(doc(firestore, collection, documentId), data)
}

const getADoc = async (collection: string, documentId: string) => {
  const docSnap = await getDoc(doc(firestore, collection, documentId))
  if (docSnap.exists()) {
    return { success: true, data: docSnap.data() }
  } else {
    return { success: false, data: {}, message: 'missing data!' }
  }
}
export { addADoc, editADoc, getADoc }
