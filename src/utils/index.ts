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

export function substringKey (str: string): string {
  const len = str.length || 0
  return `${str.substring(0, 6)}...${str.substring(len - 7)}`
}

export function getImageUrl (key: string, isDisable?: boolean): string {
  if (isDisable) {
    return `/assets/page-addAddress/key-${key?.toLowerCase()}-disable.png`
  }
  return `/assets/page-addAddress/key-${key?.toLowerCase()}.png`
}
