import { Session, SessionData, sessionService } from '~/background/services/session'
import { messageBridge } from '~/utils/messages'

interface ProviderRequest<T1 = any, T2 = any, T3 = any> {
  data: {
    method: string
    params: [T1, T2, T3]
  }
  session: Session
}

export class ProviderController {
  tabCheckin ({ session, data: { params } }: ProviderRequest<SessionData>) {
    sessionService.update(session, params[0])
  }

  route (req: ProviderRequest) {
    const { data: { method } } = req

    // @ts-ignore
    const func = this[method] as valueOf<ProviderController>
    if (func) {
      func.call(this, req)
    }
  }
}

export const providerController = new ProviderController()

export function setupProviderController () {
  messageBridge.on('provider-to-background', async (data) => {
    const tabId = data.sender.tabId
    const session = sessionService.get(tabId)!

    providerController.route({
      data: data.data,
      session,
    })
  })
}
