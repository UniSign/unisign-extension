import { ethErrors } from 'eth-rpc-errors'
import 'reflect-metadata'
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

export type PermittedKeyObjectType = KeyObjectType & {
  permission: string[]
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

  @Reflect.metadata('OPEN', true)
  tabCheckin ({ session, data: { params } }: ProviderRequest<SessionData>) {
    sessionService.update(session.id, params[0])
  }

  @Reflect.metadata('OPEN', true)
  async getProviderState () {
    return {
      isUnlocked: !(await keyringService.isLocked()),
    }
  }

  @Reflect.metadata('OPEN', true)
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

  @Reflect.metadata('OPEN', true)
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

  async requestPermissionOfCurrentKey ({ session, data }: ProviderRequest<PermittedKeyObjectType>) {
    const param = data.params[0]
    const meta = param.meta

    const currentUnikey = await personalService.getCurrentUnikey()
    if (currentUnikey) {
      const currentChain = CHAINS[currentUnikey.keySymbol]

      if (meta.coinType === currentChain.coinType && meta.chainId === currentChain.chainId) {
        // todo: go through with it
        const result = await approvalService.requestApproval({
          origin: session.origin,
          approvalPage: ApprovalPage.requestPermission,
          params: param,
        })

        return result
      }
      else {
        throw ethErrors.rpc.invalidParams('Requested key\'s metadata doesn\'t match current key\'s metadata')
      }
    }
    else {
      throw ethErrors.rpc.resourceNotFound('There isn\'t a current key')
    }
  }

  @Reflect.metadata('PROTECTED', true)
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

  @Reflect.metadata('PROTECTED', true)
  signPlainMessage ({ session, data }: ProviderRequest) {

  }

  @Reflect.metadata('PROTECTED', true)
  signTypedMessage () {

  }

  @Reflect.metadata('PROTECTED', true)
  signTransaction () {

  }

  async route (req: ProviderRequest): Promise<any> {
    const { data: { method }, session } = req
    // @ts-ignore
    const func = this[method] as valueOf<ProviderController>

    // check method exist
    if (!func) {
      throw ethErrors.rpc.methodNotFound({
        message: `method [${method}] doesn't has corresponding handler`,
        data: req.data,
      })
    }

    // todo: connect before getCurrentKeyType
    if (!Reflect.getMetadata('OPEN', this, method)) {
      // check wallet is setup
      const isSetup = await keyringService.isSetup()
      if (!isSetup) {
        throw ethErrors.provider.userRejectedRequest({
          message: 'wallet is not set up',
        })
      }

      // check if locked
      const isLocked = await keyringService.isLocked()
      if (isLocked) {
        req.needApproval = true

        await approvalService.requestApproval({
          approvalPage: ApprovalPage.unlock,
        })
      }

      // check if it has permission
      if (!siteService.hasBeenConnected(session.origin)) {
        req.needApproval = true

        await approvalService.requestApproval({
          approvalPage: ApprovalPage.requestPermission,
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
      return func.call(this, req)
    }
    else {
      throw ethErrors.rpc.methodNotFound({
        message: `method [${method}] is not supported`,
        data: req.data,
      })
    }
  }
}

export const providerController = new ProviderController()

export function setupProviderController () {
  messageBridge.on('provider-to-background', async (data) => {
    const tabId = data.sender.tabId
    const session = sessionService.getOrCreate(tabId)

    return await providerController.route({
      data: data.data,
      session,
      needApproval: false,
    })
  })
}
