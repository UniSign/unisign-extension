import { ConsoleLogger } from './ConsoleLogger'
import { ILogger } from './interface'
import { Level } from './const'

/**
 * LoggerProxy
 */
export class LoggerProxy implements ILogger {
  protected _logger: ILogger

  constructor ({ logger }: { logger: ILogger }) {
    this._logger = logger
  }

  get debug (): (message: any, ...args: any[]) => void {
    return this._logger.debug
  }

  get error (): (message: any, ...args: any[]) => void {
    return this._logger.error
  }

  get info (): (message: any, ...args: any[]) => void {
    return this._logger.info
  }

  get trace (): (message: any, ...args: any[]) => void {
    return this._logger.trace
  }

  get warn (): (message: any, ...args: any[]) => void {
    return this._logger.warn
  }

  /**
   * Set the level of the logger
   *
   * @param {Level} level
   */
  setLevel ({ level }: { level: Level }): void {
    this._logger.setLevel({ level })
  }

  /**
   * Set another concrete logger
   *
   * @param {ILogger} logger
   */
  setLogger ({ logger }: { logger: ILogger }): void {
    this._logger = logger
  }
}

export const logger = new LoggerProxy({
  logger: new ConsoleLogger({ name: 'sign', level: Level.Warn })
})
