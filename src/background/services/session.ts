import CB, { Endpoint } from 'crx-bridge'
import { siteService } from '~/background/services/site'

export interface SessionData {
  origin: string
  icon: string
  name: string
  id: number
  endpoint: Endpoint
}

export class Session {
  origin = ''
  icon = ''
  name = ''
  id = -1 // tabId
  endpoint?: Endpoint

  constructor (data?: SessionData) {
    if (data) {
      this.origin = data.origin
      this.icon = data.icon
      this.name = data.name
      this.id = data.id
      this.endpoint = data.endpoint
    }
  }
}

/**
 * Used to manage every opened tabs, which means session
 */
export class SessionService {
  private map = new Map<number, Session>()

  get (tabId: number) {
    return this.map.get(tabId)
  }

  create (id: number, data?: SessionData) {
    const session = new Session(data)
    this.map.set(id, session)

    return session
  }

  getOrCreate (tabId: number) {
    this.get(tabId) || this.create(tabId)
  }

  delete (tabId: number) {
    this.map.delete(tabId)
  }

  /**
   * send message to session's tab through provider
   * @param session
   * @param event
   * @param data
   * @return boolean indicate if message sent successfully
   */
  async sendMessage (session: Session, event: string, data: any): Promise<boolean> {
    if (session.endpoint) {
      await CB.sendMessage('background-to-provider', { event, data }, session.endpoint)
      return true
    }
    return false
  }

  /**
   * broadcast a message to all the connected site
   * @param event
   * @param data
   * @param origin
   */
  broadcast (event: string, data?: any, origin?: string) {
    let connectedSession: Session[] = []

    this.map.forEach((session) => {
      if (siteService.hasBeenConnected(session.origin)) {
        connectedSession.push(session)
      }
    })

    if (origin) {
      connectedSession = connectedSession.filter(session => session.origin === origin)
    }

    connectedSession.forEach(async (session) => {
      this.sendMessage(session, event, data).then((isSent) => {
        if (!isSent && this.map.has(session.id)) {
          this.delete(session.id)
        }
      })
    })
  }
}

export const sessionService = new SessionService()
