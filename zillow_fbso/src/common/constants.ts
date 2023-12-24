const MESSAGING: Record<any, string> = {
  OPEN_FACEBOOK_CAR_MARKETPLACE: 'OPEN_FACEBOOK_CAR_MARKETPLACE',
  UPLOAD_ITEM: 'UPLOAD_ITEM',
  GET_IMAGE_BLOB: 'GET_IMAGE_BLOB',
  SET_BLOB_FROM_URL: 'SET_BLOB_FROM_URL',
  COLLECT_CAR_DATA: 'COLLECT_CAR_DATA',
  WAIT_FOR_ACTIVE_TAB_LOADS: 'WAIT_FOR_ACTIVE_TAB_LOADS'
}

const MODE_TYPES = [
  {
    label: 'Auto',
    value: 'auto',
  },
  {
    label: 'Manual',
    value: 'manual',
  },
]

const EMOJIS = [
  {
    label: '🤘',
    value: '🤘',
  },
  {
    label: '💪',
    value: '💪',
  },
  {
    label: '😆',
    value: '😆',
  },
  {
    label: '😎',
    value: '😎',
  },
  {
    label: '🔥',
    value: '🔥',
  },
]

const INITITAL_DATA = {
  mode: MODE_TYPES[1].value,
  location: 'Texas',
  delay: 60,
  description: '',
  apiKey: '',
  emoji: '🤘',
  shouldAddSellerNotes: false,
  search: '',
  vechicles: [],
  selectedVechicles: [],
  logoUrl: '',
  websiteUrl: '',
  helpLink: '',
  autotraderPostedVehicles: [],
  byriderPostedVehicles: [],
  carforsalePostedVehicles: [],
  carsPostedVehicles: [],
  carzingPostedVehicles: [],
  scrapperUrl: '',
  whitelistString: '',
  currentVehicle: ''
}

const VECHICLE_PAGE = 'https://www.facebook.com/marketplace/create/vehicle'

type VehicleSiteTypes = 'autotrader' | 'carforsale' | 'byrider' | 'carzing' | 'cars'

interface Vehicle {
  dataMessage: string;
  uiScript: string;
  dataScript: string;
  url: string
}

const SITES_MAP: Record<VehicleSiteTypes, Vehicle> = {
  'autotrader': {
    dataMessage: 'COLLECT_AUTOTRADER_CAR_DATA',
    uiScript: 'auto-trader.js',
    dataScript: 'auto-trader-data.js',
    url: 'https://www.autotrader.com/cars-for-sale/vehicledetails.xhtml?listingId='
  },
  'carforsale': {
    dataMessage: 'COLLECT_CARFORSALE_CAR_DATA',
    uiScript: 'car-for-sale.js',
    dataScript: 'car-for-sale-data.js',
    url: 'https://www.carsforsale.com/vehicle/details/'
  },
  'byrider': {
    dataMessage: 'COLLECT_BYRIDER_CAR_DATA',
    uiScript: 'by-rider.js',
    dataScript: 'by-rider-data.js',
    url: 'https://www.byrider.com'
  },
  'carzing': {
    dataMessage: 'COLLECT_CARZING_CAR_DATA',
    uiScript: 'carzing.js',
    dataScript: 'car-zing-data.js',
    url: 'https://www.carzing.com/'
  },
  'cars': {
    dataMessage: 'COLLECT_CARS_CAR_DATA',
    uiScript: 'cars.js',
    dataScript: 'cars-data.js',
    url: 'https://www.cars.com/'
  },

}
export { MESSAGING, MODE_TYPES, INITITAL_DATA, VECHICLE_PAGE, EMOJIS, SITES_MAP, VehicleSiteTypes }
