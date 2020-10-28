declare module 'redux-watch' {
  type UnSubscribe = () => void
  type StoreChangeObserver = (newValue: any, oldValue: any, path: string) => void

  export default function watch(
    getState: () => any,
    path: string,
  ): (observer: StoreChangeObserver) => UnSubscribe
}

declare module '*.png' {
  const value: any
  export = value
}
