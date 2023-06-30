const MESSAGING = {
  START_CAMPAIGN: 'START_CAMPAIGN',
  INITIALIZE_DATA: 'INITIALIZE_DATA',
  UPDATE_PROFILES: 'UPDATE_PROFILES',
  UPDATE_PAGES_TO_SCRAP: 'UPDATE_PAGES_TO_SCRAP',
  GET_ALL_PROFILES: 'GET_ALL_PROFILES',
  GET_PAGES_TO_SCRAP: 'GET_PAGES_TO_SCRAP',
}

const FIREBASE_CREDS = {
  apiKey: 'AIzaSyCQVc6QddKVlje6P9_e80ijgRuHim2jigQ',
  authDomain: 'upwork-gpt.firebaseapp.com',
  projectId: 'upwork-gpt',
  storageBucket: 'upwork-gpt.appspot.com',
  messagingSenderId: '185322597233',
  appId: '1:185322597233:web:460f1a581e010029b364d0',
  measurementId: 'G-2ZE7EJDVKJ',
}

const initData = {
  scraping: false,
  profiles: [],
}

export { MESSAGING, FIREBASE_CREDS, initData }
