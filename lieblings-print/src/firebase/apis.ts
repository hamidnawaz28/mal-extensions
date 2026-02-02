import { doc, writeBatch } from 'firebase/firestore'
import { FIREBASE_COLLECTIONS } from '../common/const'
import { firestore } from './apps'
import { addADoc, getAllDocumentIds } from './firestoreMethods'

export const addAnItemId = async (itemId: any, data: any) =>
  await addADoc(FIREBASE_COLLECTIONS.items, itemId, data)

export const batchItemsUpload = async (items: any) => {
  const batch = writeBatch(firestore)
  items.forEach((item: any) => {
    const ref = doc(firestore, FIREBASE_COLLECTIONS.collected_items, item.itemId)
    batch.set(ref, {
      itemId: item.itemId,
      title: item.title,
      createdAt: new Date(),
    })
  })
  await batch.commit()
}

export const getAllItemsId = async () => await getAllDocumentIds(FIREBASE_COLLECTIONS.items)
export const getAllCollectedItems = async () =>
  await getAllDocumentIds(FIREBASE_COLLECTIONS.collected_items)
