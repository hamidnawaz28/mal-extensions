import { addADoc } from "./firestoreMethods";
import { FIREBASE_COLLECTIONS } from "../common/constants";


export const addCartOrder = async (data: any) =>
    await addADoc(FIREBASE_COLLECTIONS.shein, Date.now().toString(), data)
export const initQuota = (email: string) => { return email } 