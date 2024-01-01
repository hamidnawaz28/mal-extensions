const MESSAGING: Record<any, string> = {
  UPLOAD_ITEM: 'UPLOAD_ITEM',
  SET_BLOB_FROM_URL: 'SET_BLOB_FROM_URL',
  COLLECT_PROP_DATA: 'COLLECT_PROP_DATA',
  WAIT_FOR_ACTIVE_TAB_LOADS: 'WAIT_FOR_ACTIVE_TAB_LOADS',
  UPLOAD_DATA_TO_FB_PROP_SALE_MARKETPLACE: 'UPLOAD_DATA_TO_FB_PROP_SALE_MARKETPLACE',
  UPLOAD_TO_FB_PAGE: 'UPLOAD_TO_FB_PAGE',
  UPLOAD_TO_FB_PERSONAL_POST: 'UPLOAD_TO_FB_PERSONAL_POST',
  INVOKE_MARKEPLACE_LIST_PROCESS: "INVOKE_MARKEPLACE_LIST_PROCESS",
  INVOKE_PAGE_LIST_PROCESS: "INVOKE_PAGE_LIST_PROCESS",
  COLLECT_ZILLOW_REVIEW_DATA: "COLLECT_ZILLOW_REVIEW_DATA"
}

const LISTING_TYPES = [
  {
    label: "FBSO",
    value: "FSBO_LISTING",
    detailsText: "In the table below, you will see all of your scraped FSBO listings. The Listings will automatically connect with your Go High Level CRM. You can also download the list manually by clicking on the download button."
  },
  {
    label: "Reviews",
    value: "ZILLOW_REVIEWS",
    detailsText: "In the table below, you will see all of your scraped Zillow reviews. The reviews will show up on your website review widget."
  }
]
const INITITAL_DATA = {
  listingType: LISTING_TYPES[0].value,
  // fbPageUrl: "https://www.facebook.com/fullbht",
  // apiKey: 'bf3ef6ae16a3f222e72e42560c19c99b',
  fbPageUrl: "",
  apiKey: '',
  prop: {}
}

const CHECKED_START_D = 'M28.28 11.46L21 10.12l-3.52-6.9c-.83-1.63-2.19-1.63-3 0L11 10.12l-7.28 1.34c-1.8.34-2.26 1.71-1 3.06l5.16 5.6-1 7.78c-.24 1.8.9 2.6 2.53 1.77L16 26.3l6.65 3.37c1.63.83 2.77 0 2.53-1.77l-1-7.78 5.16-5.6c1.2-1.35.74-2.72-1.06-3.06z'
const FB_MARKETPLACE_PROP_SALE_PAGE = 'https://www.facebook.com/marketplace/create/rental'



export { MESSAGING, INITITAL_DATA, FB_MARKETPLACE_PROP_SALE_PAGE, LISTING_TYPES, CHECKED_START_D }
