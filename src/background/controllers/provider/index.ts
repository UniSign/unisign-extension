import { ethErrors } from 'eth-rpc-errors'
import 'reflect-metadata'
import { ApprovalPage, approvalService } from '~/background/services/approval'
import { keyringService } from '~/background/services/keyring'
import { Permissions, permissionService } from '~/background/services/permission'
import { personalService } from '~/background/services/personal'
import { Session, SessionData, sessionService } from '~/background/services/session'
import { siteService } from '~/background/services/site'
import { Unikey, unikeyService, UnikeyType } from '~/background/services/unikey'
import { CHAINS } from '~/constants'
import { messageBridge } from '~/utils/messages'

interface ProviderRequest<T1 = any> {
  data: {
    method: string
    params: [T1]
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
    chainId?: string
    chainName?: string
    symbol?: string
  }
}

export interface KeyObject extends KeyObjectType {
  key: string
}

export type PermittedKeyObjectType = KeyObjectType & {
  permissions: Permissions[]
}

export type PermittedKeyObject = KeyObject & {
  permissions: Permissions[]
}

export interface PermittedKeysResponse {
  invoker: string
  keys: PermittedKeyObject[]
}

export interface SignPlainMessageParams {
  key: KeyObject
  message: string
}

export interface SignPlainMessageResult {
  key: KeyObject
  signedMessage: string
}

export function composeKeyObjectFromUnikey (unikey: Unikey): KeyObjectType
export function composeKeyObjectFromUnikey (unikey: Unikey, withKey: boolean): KeyObject
export function composeKeyObjectFromUnikey (unikey: Unikey, withKey: boolean, permissions: Permissions[]): PermittedKeyObject
export function composeKeyObjectFromUnikey (unikey: Unikey, withKey?: boolean, permissions?: Permissions[]): KeyObject|KeyObjectType| PermittedKeyObject {
  const chain = CHAINS[unikey.keySymbol]

  const res: KeyObjectType = {
    type: UnikeyType.blockchain,
    meta: {
      coinType: chain.coinType,
      chainId: chain.chainId,
      chainName: chain.name,
      symbol: chain.unikeySymbol,
    },
  }

  if (withKey) {
    (res as KeyObject).key = unikey.key

    if (permissions) {
      (res as PermittedKeyObject).permissions = permissions
    }
  }

  return res
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
      return composeKeyObjectFromUnikey(currentUnikey)
    }
    else {
      return null
    }
  }

  @Reflect.metadata('OPEN', true)
  async getPermittedKeys ({ session: { origin } }: ProviderRequest): Promise<PermittedKeysResponse> {
    const passport = await permissionService.getSitePassport(origin)

    if (passport) {
      return {
        invoker: origin,
        // @ts-ignore
        keys: passport.consents.map((consent) => {
          const unikey = unikeyService.findUnikeyByKey(consent.key)

          if (unikey) {
            return composeKeyObjectFromUnikey(unikey, true, consent.permissions)
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

  async requestPermissionsOfCurrentKey ({ session, data }: ProviderRequest<PermittedKeyObjectType>): Promise<{permittedPermissions: Permissions[]; deniedPermissions: Permissions[]}> {
    const param = data.params[0]
    const meta = param.meta

    // todo: use a more proper way to valid the validity of the params
    if (!meta) {
      throw ethErrors.rpc.invalidParams('Missing params when requesting \'requestPermissionOfCurrentKey\': meta')
    }

    const currentUnikey = await personalService.getCurrentUnikey()
    if (currentUnikey) {
      const currentChain = CHAINS[currentUnikey.keySymbol]

      if (meta.coinType === currentChain.coinType && meta.chainId === currentChain.chainId) {
        const permittedPermissions = await approvalService.requestApproval<Permissions[]>({
          approvalPage: ApprovalPage.requestPermission,
          origin: session.origin,
          params: param,
        }) || []

        const deniedPermissions = param.permissions.filter(perm => !permittedPermissions.includes(perm))

        permissionService.addSitePassport(session.origin, {
          key: currentUnikey.key,
          permissions: permittedPermissions,
        })

        if (!siteService.hasBeenConnected(session.origin)) {
          siteService.addSite({
            origin: session.origin,
            name: session.name,
            icon: session.icon,
            unikeySymbol: currentChain.unikeySymbol,
          })
        }

        return {
          permittedPermissions,
          deniedPermissions,
        }
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
  async getCurrentKey (): Promise<KeyObject|null> {
    const currentUnikey = await this._getCurrentUnikey()

    if (currentUnikey) {
      return composeKeyObjectFromUnikey(currentUnikey, true)
    }
    else {
      return null
    }
  }

  @Reflect.metadata('PROTECTED', true)
  async signPlainMessage ({ session, data }: ProviderRequest<SignPlainMessageParams>): Promise<SignPlainMessageResult> {
    const param = data.params[0]
    const { key, message } = param

    const currentKey = await this._getCurrentUnikey()

    if (currentKey?.key && currentKey.key === key.key) {
      await approvalService.requestApproval<Permissions[]>({
        approvalPage: ApprovalPage.signPlainMessage,
        origin: session.origin,
        params: param,
      })

      const signedMessage = await keyringService.signPlainMessage({
        from: key.key,
        data: message,
      })

      return {
        key: composeKeyObjectFromUnikey(currentKey, true),
        signedMessage,
      }
    }
    else {
      throw ethErrors.rpc.invalidParams('Requested key does not match current key')
    }
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
    }

    if (Reflect.getMetadata('PROTECTED', this, method)) {
      req.needApproval = true

      const currentUnikey = (await this._getCurrentUnikey())!

      // check if it has permission. If not, we will request the permission for developers
      if (!permissionService.hasPermission(session.origin, currentUnikey.key, method as Permissions)) {
        const permissionReq = composeKeyObjectFromUnikey(currentUnikey, true, [method as Permissions])

        await this.requestPermissionsOfCurrentKey({
          session,
          data: {
            method: 'requestPermissionsOfCurrentKey',
            params: [permissionReq],
          },
          needApproval: true,
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
      data: data.data as any,
      session,
      needApproval: false,
    })
  })
}
