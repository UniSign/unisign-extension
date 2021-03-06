import { EthereumProviderError, ethErrors } from 'eth-rpc-errors'
import browser from 'webextension-polyfill'
import { AutoBindService } from '~/background/services/base/auto-bind'
import { CreateWindowProps, windows } from '~/background/tools/windows'
import { IS_CHROME, IS_LINUX } from '~/env'

export enum ApprovalPage {
  unlock = '/setup/locked',
  requestPermission = '/approval/requestPermission',
  signPlainMessage = '/approval/signPlainMessage',
  signStructMessage = '/approval/signStructMessage',
  signTransaction = '/approval/signTransaction',
}

export interface ApprovalData<T = any> {
  params?: T
  origin?: string
  approvalPage: ApprovalPage
  requestDefer?: Promise<any>
}

interface Approval {
  data: ApprovalData
  resolve(params?: any): void
  reject(err: EthereumProviderError<any>): void
}

/**
 * This manage the approval popup window which need to be confirmed or cancelled by user.
 *
 * Every time we need a approval, we should call `requestApproval`, which will save the approval data in `this.approval` and open a popup window afterwards
 * The opened popup window will retrieve the approval data in `this.approval` through `requestApproval` and wait for user action
 *
 * There can be only one opened popup window at the same time.
 * Once the window lose focus, it will be closed automatically
 */
export class ApprovalService extends AutoBindService {
  approval: Approval | null = null
  approvalWindowId = 0

  constructor () {
    super()
    this.init()
  }

  init () {
    browser.windows.onFocusChanged.addListener(this.onApprovalWindowFocusChanged)
    browser.windows.onRemoved.addListener(this.onApprovalWindowRemoved)
  }

  async getApproval (): Promise<ApprovalData|null> {
    return this.approval?.data || null
  }

  async resolveApproval (data?: any) {
    this.approval?.resolve(data)
    await this.clear()
  }

  async rejectApproval (errMsg?: string) {
    this.approval?.reject(ethErrors.provider.userRejectedRequest<any>(errMsg))
    await this.clear()
  }

  async requestApproval<T = any> (data: ApprovalData, windowProps?: CreateWindowProps): Promise<T> {
    // currently, we only support one approval at a time
    if (this.approval) {
      throw ethErrors.provider.userRejectedRequest('There is already a approval, please wait for it resolves')
    }

    return new Promise((resolve, reject) => {
      this.approval = {
        data,
        resolve,
        reject,
      }

      this.openApprovalWindow(data.approvalPage, windowProps)
    })
  }

  private async clear () {
    this.approval = null

    if (this.approvalWindowId) {
      await windows.remove(this.approvalWindowId)
      this.approvalWindowId = 0
    }
  }

  private onApprovalWindowRemoved (windowId: number) {
    if (windowId === this.approvalWindowId) {
      this.rejectApproval().then(() => console.log(`Window ${windowId} lost focus, so the approval was rejected`))
    }
  }

  /**
   * Fired when the currently focused window changes.
   * Will be browser.windows.WINDOW_ID_NONE if all browser windows have lost focus.
   * Note: On some Linux window managers, WINDOW_ID_NONE will always be sent immediately preceding a switch from one browser window to another.
   * @param windowId new focused window's id
   */
  private onApprovalWindowFocusChanged (windowId: number) {
    if (this.approvalWindowId && windowId !== this.approvalWindowId) {
      if (process.env.NODE_ENV === 'production') {
        if ((IS_CHROME && windowId === browser.windows.WINDOW_ID_NONE && IS_LINUX)) return

        this.rejectApproval().then(() => console.log(`Window ${windowId} lost focus, so the approval was rejected`))
      }
    }
  }

  private openApprovalWindow (route: string, windowProps?: CreateWindowProps) {
    if (this.approvalWindowId) {
      windows.remove(this.approvalWindowId).then(() => {
        this.approvalWindowId = 0
      })
    }

    windows.createApproval(route, windowProps).then((windowId) => {
      this.approvalWindowId = windowId
    })
  }
}

export const approvalService = new ApprovalService()
