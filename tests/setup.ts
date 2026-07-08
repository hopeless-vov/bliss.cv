/*
 * Node ≥22 ships a global `localStorage` that is non-functional without the
 * --localstorage-file flag, and it shadows happy-dom's implementation in the
 * test environment. Replace it with a real in-memory Storage so app code
 * (vueuse useLocalStorage) and tests behave like a browser.
 */
const store = new Map<string, string>()

const memoryStorage: Storage = {
  get length() {
    return store.size
  },
  clear: () => store.clear(),
  getItem: (key) => (store.has(key) ? (store.get(key) ?? null) : null),
  key: (index) => [...store.keys()][index] ?? null,
  removeItem: (key) => {
    store.delete(key)
  },
  setItem: (key, value) => {
    store.set(key, String(value))
  },
}

Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: memoryStorage })
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'localStorage', { configurable: true, value: memoryStorage })
}
