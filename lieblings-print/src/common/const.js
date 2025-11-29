const MESSAGING = {
  SET_BLOB_FROM_URL: 'SET_BLOB_FROM_URL',
  OPEN_OAUTH: 'OPEN_OAUTH',
  WAIT_TILL_ACTIVE_TAB_LOADS: 'WAIT_TILL_ACTIVE_TAB_LOADS',
  GET_EBAY_ITEM_DATA: 'GET_EBAY_ITEM_DATA',
  UPDATE_ACTIVE_TAB_URL: 'UPDATE_ACTIVE_TAB_URL',
}

const TEMU_MESSAGES = {
  INJECT_ADD_PRODUCT_SCRIPT: 'INJECT_ADD_PRODUCT_SCRIPT',
  ENTER_INITIAL_DETAILS: 'ENTER_INITIAL_DETAILS',
  CLICK_ON_NEXT_BUTTON: 'CLICK_ON_NEXT_BUTTON',
  ENTER_REMAINING_DETAILS: 'ENTER_REMAINING_DETAILS',
}
const PLACE_ORDER = {
  PLACE_ORDER: 'PLACE_ORDER',
  INJECT_PLACE_ORDER_SCRIPT: 'INJECT_PLACE_ORDER_SCRIPT',
}
const SYNC_TRACKING_NUMBER = {
  SYNC_TRACKING_NUMBER: 'SYNC_TRACKING_NUMBER',
  INJECT_SYNC_TRACKING_NUMBER_SCRIPT: 'INJECT_SYNC_TRACKING_NUMBER_SCRIPT',
}

const EBAY = {
  AUTH_BASE_URL: 'https://auth.ebay.com/',
  API_BASE_URL: 'https://api.ebay.com/',
  AUTH_REDIRECT_URL: 'https://auth2.ebay.com/oauth2/ThirdPartyAuthSucessFailure?isAuthSuccessful=',
  AUTH_REDIRECT_URI: 'hamid_nawaz-hamidnaw-Liebli-koxfrczys',
  AUTH_CODE:
    'aGFtaWRuYXctTGllYmxpbmctUFJELTY2ZTkwYzA2YS03YzY5OTRlMDpQUkQtNmU5MGMwNmFiNmJhLWI1ZmQtNGQzYy04OWE3LTE2M2Y=',
  CLIENT_ID: 'hamidnaw-Liebling-PRD-66e90c06a-7c6994e0',
  REDIRECT_URI: 'hamid_nawaz-hamidnaw-Liebli-koxfrczys',
  SCOPES: [
    'https://api.ebay.com/oauth/api_scope',
    'https://api.ebay.com/oauth/api_scope/sell.marketing.readonly',
    'https://api.ebay.com/oauth/api_scope/sell.marketing',
    'https://api.ebay.com/oauth/api_scope/sell.inventory.readonly',
    'https://api.ebay.com/oauth/api_scope/sell.inventory',
    'https://api.ebay.com/oauth/api_scope/sell.account.readonly',
    'https://api.ebay.com/oauth/api_scope/sell.account',
    'https://api.ebay.com/oauth/api_scope/sell.fulfillment.readonly',
    'https://api.ebay.com/oauth/api_scope/sell.fulfillment',
    'https://api.ebay.com/oauth/api_scope/sell.analytics.readonly',
    'https://api.ebay.com/oauth/api_scope/sell.finances',
    'https://api.ebay.com/oauth/api_scope/sell.payment.dispute',
    'https://api.ebay.com/oauth/api_scope/commerce.identity.readonly',
    'https://api.ebay.com/oauth/api_scope/sell.reputation',
    'https://api.ebay.com/oauth/api_scope/sell.reputation.readonly',
    'https://api.ebay.com/oauth/api_scope/commerce.notification.subscription',
    'https://api.ebay.com/oauth/api_scope/commerce.notification.subscription.readonly',
    'https://api.ebay.com/oauth/api_scope/sell.stores',
    'https://api.ebay.com/oauth/api_scope/sell.stores.readonly',
    'https://api.ebay.com/oauth/scope/sell.edelivery',
    'https://api.ebay.com/oauth/api_scope/commerce.vero',
    'https://api.ebay.com/oauth/api_scope/sell.inventory.mapping',
    'https://api.ebay.com/oauth/api_scope/commerce.message',
    'https://api.ebay.com/oauth/api_scope/commerce.feedback',
    'https://api.ebay.com/oauth/api_scope/commerce.shipping',
  ],
}

export { SYNC_TRACKING_NUMBER, MESSAGING, EBAY, TEMU_MESSAGES, PLACE_ORDER }
