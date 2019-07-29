import localforage from 'localforage';

export const settingLf = localforage.createInstance({
  name: 'setting',
  storeName: 'setting'
})

export const env = localforage.createInstance({
  name: 'env',
  storeName: 'env'
})