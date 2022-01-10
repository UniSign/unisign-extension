const onDomReady = (callback: ($: typeof document.querySelector) => void) => {
  const $ = document.querySelector.bind(document)

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    callback($)
  }
  else {
    const domContentLoadedHandler = () => {
      callback($)
      document.removeEventListener('DOMContentLoaded', domContentLoadedHandler)
    }
    document.addEventListener('DOMContentLoaded', domContentLoadedHandler)
  }
}
export { onDomReady }
