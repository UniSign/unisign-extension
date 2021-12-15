const forbiddenProtocols = [
  'chrome-extension://',
  'chrome-search://',
  'chrome://',
  'devtools://',
  'edge://',
  'https://chrome.google.com/webstore',
]

export function isForbiddenUrl (url: string): boolean {
  return forbiddenProtocols.some(protocol => url.startsWith(protocol))
}

export const isFirefox = /Firefox/i.test(navigator.userAgent)
export const IS_WINDOWS = /windows/i.test(navigator.userAgent)
export const IS_CHROME = /Chrome/i.test(navigator.userAgent)
export const IS_LINUX = /linux/i.test(navigator.userAgent)
