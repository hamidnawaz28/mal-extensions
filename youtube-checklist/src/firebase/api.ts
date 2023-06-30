import axios from 'axios'
import { addADoc, getADoc } from './firestoreMethods'

const setUsersData = async (id: string, data: any) => {
  return await addADoc('init_data', id, data)
}

const getUsersData = async (id: string) => {
  const respo = await getADoc('init_data', id)
  return respo.data
}

const setUserQuota = async (email: string, by = 0) => {
  const prevQuota = await getUserQuota(email)

  let newQuota = prevQuota - by
  if (newQuota <= 0) {
    newQuota = 0
  }
  return await setUsersData(email, { quota: newQuota })
}

const initQuota = async (email: string) => await setUsersData(email, { quota: 10 })
const getUserQuota = async (id: string) => {
  const resp: any = await getUsersData(id)
  return resp.quota
}

const verifyEmail = async (email: string) => {
  const resp = await axios.get(
    `https://api.bouncify.io/v1/verify?apikey=xnz009olzeagfaolq7xuzgcs5bzd0f3c&email=${email}`,
  )
  return resp.data.result
}
export { verifyEmail, setUsersData, getUsersData, setUserQuota, getUserQuota, initQuota }
