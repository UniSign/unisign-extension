import 'reflect-metadata'
import { ethErrors } from 'eth-rpc-errors'
import { ApprovalPage, approvalService } from '~/background/services/approval'
import { keyringService } from '~/background/services/keyring'
import { personalService } from '~/background/services/personal'
import { Session, SessionData, sessionService } from '~/background/services/session'
import { siteService } from '~/background/services/site'
import { Unikey, unikeyService, UnikeyType } from '~/background/services/unikey'
import { CHAINS, KeyIdentifier } from '~/constants'
import { messageBridge } from '~/utils/messages'

interface ProviderRequest<T1 = any, T2 = any, T3 = any> {
  data: {
    method: string
    params: [T1, T2, T3]
  }
  session: Session
  needApproval: boolean
}

export interface KeyObjectType {
  type: UnikeyType
  // currently we only have blockchain meta
  meta: {
    coinType: string
    chainId: string
    chainName?: string
    symbol?: string
  }
}

export interface KeyObject extends KeyObjectType {
  key: string
}

export class ProviderController {
  private async getCurrentUnikey (): Promise<Unikey|null> {
    let unikey = personalService.getCurrentUnikey()

    if (!unikey) {
      [unikey] = await unikeyService.getVisibleUnikeys()

      if (unikey) {
        personalService.setCurrentUnikey(unikey.key)
      }
    }

    return unikey
  }

  tabCheckin ({ session, data: { params } }: ProviderRequest<SessionData>) {
    sessionService.update(session, params[0])
  }

  async getCurrentKey ({ session: { origin } }: ProviderRequest): Promise<Unikey|null> {
    if (!siteService.hasBeenConnected(origin)) {
      return null
    }

    // todo: the response should be rethink
    return await this.getCurrentUnikey()
  }

  @Reflect.metadata('SAFE', true)
  async getCurrentKeyType (): Promise<KeyObjectType | null> {
    const currentUniKey = await this.getCurrentUnikey()

    if (currentUniKey) {
      const chain = CHAINS[currentUniKey.keySymbol]

      return {
        type: currentUniKey.keyType,
        meta: {
          coinType: chain.coinType,
          chainId: chain.chainId || '',
          chainName: chain.name,
          symbol: chain.identifier,
        },
      }
    }
    else {
      return null
    }
  }

  async route (req: ProviderRequest) {
    const { data: { method }, session } = req
    // @ts-ignore
    const func = this[method] as valueOf<ProviderController>

    if (!func) {
      throw ethErrors.rpc.methodNotFound({
        message: `method [${method}] doesn't has corresponding handler`,
        data: req.data,
      })
    }

    if (!Reflect.getMetadata('SAFE', this, method)) {
      // check if locked
      const isLocked = await keyringService.isLocked()
      if (isLocked) {
        req.needApproval = true

        await approvalService.requestApproval({
          approvalPage: ApprovalPage.unlock,
        })
      }

      // check if connected
      if (!siteService.hasBeenConnected(session.origin)) {
        req.needApproval = true

        await approvalService.requestApproval({
          approvalPage: ApprovalPage.connect,
          params: {
            origin: session.origin,
            name: session.name,
            icon: session.icon,
          },
        })

        siteService.addSite({
          origin: session.origin,
          name: session.name,
          icon: session.icon,
          unikeySymbol: KeyIdentifier.BTC, // todo: this should come from connect page
        })
      }
    }

    if (func) {
      // @ts-ignore
      func.call(this, req)
    }
  }
}

export const providerController = new ProviderController()

export function setupProviderController () {
  messageBridge.on('provider-to-background', async (data) => {
    const tabId = data.sender.tabId
    const session = sessionService.get(tabId)!

    await providerController.route({
      data: data.data,
      session,
      needApproval: false,
    })
  })
}
