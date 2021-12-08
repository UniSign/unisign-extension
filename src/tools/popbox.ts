import browser, { Windows } from 'webextension-polyfill'
import { IS_WINDOWS } from '~/constants'

const BROWSER_HEADER = 80
const WINDOW_SIZE = {
  width: 400 + (IS_WINDOWS ? 14 : 0), // idk why windows cut the width.
  height: 600,
}

export const createPopbox = async ({ route, ...rest }: any): Promise<number | undefined> => {
  const { top: cTop, left: cLeft, width } = await browser.windows.getCurrent({
    windowTypes: ['normal'],
  } as Windows.GetInfo)

  const top = cTop! + BROWSER_HEADER
  const left = cLeft! + width! - WINDOW_SIZE.width

  const win = await browser.windows.create({
    focused: true,
    url: `dist/ui/popbox/index.html${route && `#/${route}`}`,
    type: 'popup',
    top,
    left,
    ...WINDOW_SIZE,
    ...rest,
  })

  // shim firefox
  if (win.left !== left) {
    await browser.windows.update(win.id!, { left, top })
  }

  return win.id
}

export const removePopbox = async (winId: number) => {
  return browser.windows.remove(winId)
}
