export function isNullOrEmpty (str: any): boolean {
  if (str === 'undefined' || !str || !/[^\s]/.test(str)) {
    return true
  }
  else {
    return false
  }
}

export function sleep (ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
