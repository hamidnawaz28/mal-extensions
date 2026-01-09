import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore'
import { firestore } from './apps'

const addADoc = async (collection: string, documentId: string, data: any) => {
  await setDoc(doc(firestore, collection, documentId), data)
  return documentId
}

const editADoc = async (collection: string, documentId: string, data: any) => {
  const prevData = await getADoc(collection, documentId)
  await setDoc(doc(firestore, collection, documentId), { ...prevData.data, ...data })
}

export const getAllDocumentIds = async (collectionName: string) => {
  const snapshot = await getDocs(collection(firestore, collectionName))
  return snapshot.docs.map((doc) => doc.id)
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
