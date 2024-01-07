import axios from 'axios'
import { getLocalStorage } from './browerMethods'

export const apiFactory = {
  getListings: async () => {
    return await apiCall("get_info", {}, 'real-estate-listing')
  },
  saveListing: async (data: any) => {
    data.baths = parseInt(data?.baths) ?? 0
    data.bedrooms = parseInt(data?.bedrooms) ?? 0
    data.price = parseInt(data.price) ?? 0
    data.sq_ft = parseInt(data.sq_ft) ?? 0
    return await apiCall("real_estate_listing", data, 'real-estate-listing')
  },
  deleteListing: async (real_estate_listing_id: string) => {
    return await apiCall("delete", { real_estate_listing_id }, 'real-estate-listing')
  },
  deleteAllListings: async () => {
    return await apiCall("delete_all", {}, 'real-estate-listing')
  },
  getReviews: async () => {
    return await apiCall("get_info", {}, 'real-estate-review')
  },
  saveReview: async (data: any) => {
    return await apiCall("real_estate_review", data, 'real-estate-review')
  },
  deleteReview: async (real_estate_review_id: string) => {
    return await apiCall("delete", { real_estate_review_id }, 'real-estate-review')
  },
  deleteAllReviews: async () => {
    return await apiCall("delete_all", {}, 'real-estate-review')
  },
}

const apiCall = async (type: string, data: any, dataType: 'real-estate-review' | 'real-estate-listing') => {
  const localStorage = await getLocalStorage()


  const dataSerielized = JSON.stringify({
    "api_key": localStorage.apiKey,
    ...data,
    type
  });

  const config = {
    method: 'post',
    url: `https://sag.gemquery.com/webhook/${dataType}`,
    headers: {
      'Content-Type': 'application/json'
    },
    data: dataSerielized
  };
  try {
    const response = await axios.request(config)
    if (response?.data?.success) {
      return response.data
    } else {
      return {}
    }
  } catch (err: any) {
    return {}
  }
}
