import { FIREBASE_COLLECTIONS } from '../common/const'
import { addADoc, getAllDocumentIds } from './firestoreMethods'

export const addAnItemId = async (itemId: any, data: any) =>
  await addADoc(FIREBASE_COLLECTIONS.items, itemId, data)

export const getAllItemsId = async () => await getAllDocumentIds(FIREBASE_COLLECTIONS.items)
