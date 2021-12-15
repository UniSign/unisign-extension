export function isNullOrEmpty (str: any): boolean {
  if (str === 'undefined' || !str || !/[^\s]/.test(str)) {
    return true
  }
  else {
    return false
  }
}
