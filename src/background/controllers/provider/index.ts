import 'reflect-metadata'
import { ethErrors } from 'eth-rpc-errors'
import { ApprovalPage, approvalService } from '~/background/services/approval'
import { keyringService } from '~/background/services/keyring'
import { permissionService } from '~/background/services/permission'
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

// the KeyObject as per API
export interface KeyObjectType {
  type: UnikeyType
  // currently, we only have blockchain meta
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

export type PermittedKeyObject = KeyObject & {
  permission: string[]
}

export interface PermittedKeysResponse {
  invoker: string
  keys: PermittedKeyObject[]
}

export class ProviderController {
  private async _getCurrentUnikey (): Promise<Unikey|null> {
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

  async getCurrentKey ({ session: { origin } }: ProviderRequest): Promise<KeyObjectType|null> {
    if (!siteService.hasBeenConnected(origin)) {
      return null
    }

    const currentUnikey = await this._getCurrentUnikey()

    if (currentUnikey) {
      const chain = CHAINS[currentUnikey.keySymbol]

      return {
        type: currentUnikey.keyType,
        meta: {
          coinType: chain.coinType,
          chainId: chain.chainId || '',
          chainName: chain.name,
          symbol: chain.unikeySymbol,
        },
      }
    }
    else {
      return null
    }
  }

  requestPermissionOfCurrentKey () {
  }

  async getPermittedKeys ({ session: { origin } }: ProviderRequest): Promise<PermittedKeysResponse> {
    const passport = await permissionService.getPassport(origin)

    if (passport) {
      return {
        invoker: origin,
        // @ts-ignore
        keys: passport.authorities.map((authority) => {
          const unikey = unikeyService.findUnikeyByKey(authority.key)

          if (unikey) {
            const chain = CHAINS[unikey.keySymbol]
            return {
              type: unikey.keyType,
              key: unikey.key,
              meta: {
                coinType: chain.coinType,
                chainId: chain.chainId,
                chainName: chain.name,
                symbol: chain.tokenSymbol,
              },
              permission: authority.permissions,
            } as PermittedKeyObject
          }
          return null
        }).filter(unikey => !!unikey),
      }
    }

    return {
      invoker: origin,
      keys: [],
    }
  }

  @Reflect.metadata('SAFE', true)
  async getCurrentKeyType (): Promise<KeyObjectType | null> {
    const currentUnikey = await this._getCurrentUnikey()

    if (currentUnikey) {
      const chain = CHAINS[currentUnikey.keySymbol]

      return {
        type: currentUnikey.keyType,
        meta: {
          coinType: chain.coinType,
          chainId: chain.chainId || '',
          chainName: chain.name,
          symbol: chain.tokenSymbol,
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
