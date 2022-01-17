import browser from 'webextension-polyfill'
import { messageBridge, Endpoint } from '~/utils/messages'
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

  constructor () {
    this.init()
  }

  init () {
    browser.tabs.onRemoved.addListener((tabId) => {
      this.delete(tabId)
    })
  }

  get (tabId: number): Session|undefined {
    return this.map.get(tabId)
  }

  create (tabId: number, data?: SessionData): Session {
    const session = new Session(data)
    session.id = tabId
    this.map.set(tabId, session)

    return session
  }

  update (sessionId: number, data: Pick<SessionData, 'origin' | 'icon' | 'name'>) {
    const session = this.map.get(sessionId)

    if (session) {
      session.origin = data.origin
      session.icon = data.icon
      session.name = data.name
    }
  }

  getOrCreate (tabId: number): Session {
    return this.get(tabId) || this.create(tabId)
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
      await messageBridge.send('background-to-provider', { event, data }, session.endpoint)
      return true
    }
    return false
  }

  /**
   * broadcast a message to all the sessions or only the sessions with target origin
   * @param event
   * @param data
   * @param targetOrigin
   */
  broadcast (event: string, data?: any, targetOrigin?: string) {
    let connectedSession: Session[] = []

    this.map.forEach((session) => {
      if (siteService.hasBeenConnected(session.origin)) {
        connectedSession.push(session)
      }
    })

    if (targetOrigin) {
      connectedSession = connectedSession.filter(session => session.origin === targetOrigin)
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
