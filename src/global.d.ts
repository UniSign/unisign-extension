declare const __DEV__: boolean

declare module '*.vue' {
  const component: any
  export default component
}

type valueOf<T> = T[keyof T]
