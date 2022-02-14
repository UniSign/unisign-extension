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

export function substringKey (str: string, head = 6, tail = 7) {
  if (!str) return
  const len = str.length || 0
  return `${str.substring(0, head)}...${str.substring(len - tail)}`
}

type UrlType = 'agreement' | 'domainName'
export function substringUrl (url: string, urlType: UrlType) {
  if (!url) return
  if (url.includes('https')) {
    if (urlType === 'agreement') {
      return url.substring(0, 8)
    }
    else {
      if (url.length > 26) {
        return `${url.substring(8, 26)}...`
      }
      else {
        return url.substring(8)
      }
    }
  }
  else if (url.includes('http')) {
    if (urlType === 'agreement') {
      return url.substring(0, 7)
    }
    else {
      if (url.length > 26) {
        return `${url.substring(7, 26)}...`
      }
      else {
        return url.substring(7)
      }
    }
  }
  else {
    if (urlType === 'agreement') {
      return ''
    }
    else {
      return url
    }
  }
}

export function getImageUrl (key: string, isDisable?: boolean): string {
  if (isDisable) {
    return `/assets/page-addAddress/key-${key?.toLowerCase()}-disable.png`
  }
  return `/assets/page-addAddress/key-${key?.toLowerCase()}.png`
}
