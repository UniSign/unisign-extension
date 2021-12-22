import browser, { Windows } from 'webextension-polyfill'
import { IS_WINDOWS } from '~/env'

const BROWSER_HEADER = 80
const WINDOW_SIZE = {
  width: 400 + (IS_WINDOWS ? 14 : 0), // idk why windows cut the width.
  height: 600,
}

export interface CreateWindowProps {
  url: string
  height?: number
  width?: number
}

export const windows = {
  async create (url: string, windowProps?: CreateWindowProps): Promise<number> {
    const { top: cTop, left: cLeft, width } = await browser.windows.getCurrent({
      windowTypes: ['normal'],
    } as Windows.GetInfo)

    const top = cTop! + BROWSER_HEADER
    const left = cLeft! + width! - WINDOW_SIZE.width

    const win = await browser.windows.create({
      focused: true,
      type: 'popup',
      top,
      left,
      ...WINDOW_SIZE,
      ...windowProps,
    })

    // shim firefox
    if (win.left !== left) {
      await browser.windows.update(win.id!, { left, top })
    }

    return win.id!
  },

  createApproval (route: string, windowProps?: CreateWindowProps): Promise<number> {
    const url = `dist/ui/popup/index.html#${route}`

    return this.create(url, windowProps)
  },

  remove (windowId: number) {
    return browser.windows.remove(windowId)
  },

  async getCurrentTab () {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true })
    return tabs[0]
  },
}
