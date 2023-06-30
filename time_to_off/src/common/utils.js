import Browser from "webextension-polyfill";

async function setStorageLocal(data) {
  await Browser.storage.local.set({ care: data });
}
async function getStorageLocal() {
  const resp = await Browser.storage.local.get();
  return resp.care;
}

async function setStorageSync(data) {
  await Browser.storage.sync.set({ care: data });
}
async function getStorageSync() {
  const resp = await Browser.storage.sync.get();
  return resp.care;
}

export { setStorageLocal, getStorageLocal, setStorageSync, getStorageSync };
