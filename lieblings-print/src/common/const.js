const MESSAGING = {
  WAIT_TILL_ACTIVE_TAB_LOADS: 'WAIT_TILL_ACTIVE_TAB_LOADS',
  GET_EBAY_ITEM_DATA: 'GET_EBAY_ITEM_DATA',
  UPDATE_ACTIVE_TAB_URL: 'UPDATE_ACTIVE_TAB_URL',
  ADD_ITEM_DATA: 'ADD_ITEM_DATA',
  GET_ALL_ITEMS_ID: 'GET_ALL_ITEMS_ID',
}

const ADD_PRODUCT = {
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
  ].join('%20'),
}
const ITEM_DESCRIPTION =
  'Beginnen Sie jeden Tag mit wahrer Freude, indem Sie zu unserer außergewöhnlichen Kaffeetasse greifen, die entworfen wurde, um jeden Moment Ihres Lieblingsgetränks zu feiern. Diese Tasse ist viel mehr als nur ein Gefäß – sie ist Ihr persönliches Ritual, das einen gewöhnlichen Morgenkaffee in pure Entspannung und Genuss verwandelt. Aus hochwertig ausgewählter Keramik gefertigt, garantiert dieses Stück unvergleichliche Haltbarkeit und beeindruckt mit seiner glatten Oberfläche und komfortablen Form. Der ergonomische Griff sorgt für maximalen Komfort und liegt perfekt in der Hand, egal, ob Sie einen schnellen Espresso oder aromatischen Cappuccino schlürfen – oder große, wärmende Teetassen genießen. Die Kapazität wurde optimal gewählt, damit Sie Ihre Lieblingsmenge an Getränk genießen können, ohne ständig nachfüllen zu müssen, egal, ob Sie starken schwarzen Kaffee zum Aufwachen oder zarten Latte mit fluffigem Schaum bevorzugen. Unsere Tasse erfüllt alle Erwartungen mit ihrem universellen, aber eleganten Design, das sich gut in jede Küchendekoration einfügt, von minimalistischen modernen Räumen bis hin zu gemütlichen Landhaus-Atmosphären. Die neutrale Farbpalette (oder bestimmte Farben, falls dies eine Überlegung ist, wie Weiß/Schwarz Pastelltöne) macht das Schlürfen zeitlos und immer stilvoll. Die perfekte Geschenkidee für jeden Anlass – suchen Sie ein Geburtstagsgeschenk, eine Feiertagsfreude für Freunde oder eine wertschätzende Geste für Familie und Kollegen? DIESE TASSE ist die perfekte Wahl für jeden Kaffee- oder Teeliebhaber. Praktisch & ästhetisch, garantiert sie ein Lächeln auf dem Gesicht des Beschenkten. Außerdem ist sie spülmaschinengeeignet für einfache Reinigung und Zeitersparnis, hitzebeständig und mikrowellengeeignet'
const ITEM_DETAILS = [
  'Tassen für jeden Anlass Diese originelle Statement Tasse ist das ideale Geschenk für jeden Büromenschen oder Kaffeetrinker! Wir bieten die passende Tasse als kreative Überraschung für jeden Anlass - ein Mitbringsel, das von Herzen kommt. · Ideale Bürotasse Weg mit den öden Einheitstassen im Schrank! Diese außergewöhnliche Kaffeetasse bringt frischen Wind in die Teeküche und lässt sich für alle Kalt- oder Heißgetränke einsetzen. Der ideale Begleiter für zuhause, im Büro oder auf dem Bau. Eine tolle Geschenkidee für Tee-, Kaffee- oder Kakaotrinker.',
  'Originelle Sprüche Unsere einfallsreichen Sprüche sorgen für Abwechslung auf jedem Büro- oder Küchentisch und zaubern sofort ein Lächeln aufs Gesicht. Als Wichtelgeschenk, zu Weihnachten, zum Geburtstag, zur Beförderung oder einfach nur so, um einem lieben Menschen eine Freude zu bereiten. Dieser Becher ist ein richtiger Hingucker für alle, die das Leben mit Humor nehmen. · Hochwertige Verarbeitung Die Tasse wird beidseitig in höchster Farbbrillanz bedruckt, sodass sie sowohl für Links- als auch Rechtshänder ideal geeignet ist. Der großzügige Henkel in C-Form liegt angenehm in der Hand und sorgt auch dann für einen festen Halt, wenn die Tasse befüllt ist. So lässt sich das',
  'Meine neue Lieblingstasse Die hochwertige Tasse aus Keramik hat eine großzügige Füllmenge von 330ml und ist somit der ideale Becher für alle Heißgetränke. Der originelle Statement-Spruch bringt sofort gute Laune und verschönert jeden tristen Morgen. Aus dieser Spruchtasse schmeckt der morgendliche Kaffee gleich ein Stückchen besser!',
  'Eine perfekte Geschenkidee· Pflegeleicht und Spülmaschinenfest Unsere hochwertigen Tassen sind spülmaschinenfest und überzeugen durch die hohe Langlebigkeit. Unser hoher Qualitätsstandard ermöglicht 2500 Spülgänge ohne Verlust der Druckqualität. Dennoch raten wir dazu, die Tassen bevorzugt per Hand abzuwaschen, um die Langlebigkeit des Drucks zu verlängern.',
  'Mit Liebe aus Deutschland Unsere Tassen werden mit viel Liebe zum Detail gestaltet und in sorgfältiger Handarbeit beidseitig bedruckt. Es handelt sich bei den Spruchtassen nicht um reine Dekorationsobjekte, sondern um lebensmittelechte Qualitätsware Made in Germany. Nicht nur der Druck unserer Motive wird in Deutschland ausgeführt, sondern wir versenden unsere Produkte auch von hier aus. Für langlebige Produkte und höchste Kundenzufriedenheit!',
]

const FIREBASE_INIT = {
  apiKey: 'AIzaSyAUk0rUd1BbQb8IA1O9F3G6iY0S6GppNkc',
  authDomain: 'contentcue-66e03.firebaseapp.com',
  projectId: 'contentcue-66e03',
  storageBucket: 'contentcue-66e03.appspot.com',
  messagingSenderId: '710922429474',
  appId: '1:710922429474:web:cd32b8263708d1cfb5167b',
  measurementId: 'G-6CNHC5EY6E',
}

const FIREBASE_COLLECTIONS = {
  items: 'items',
}
export {
  SYNC_TRACKING_NUMBER,
  MESSAGING,
  EBAY,
  ADD_PRODUCT,
  PLACE_ORDER,
  ITEM_DESCRIPTION,
  ITEM_DETAILS,
  FIREBASE_INIT,
  FIREBASE_COLLECTIONS,
}
