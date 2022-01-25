import { ILogger } from './interface'
import { Level } from './const'

const levelToName: { [key: number]: string } = {
  [Level.Trace]: 'TRACE',
  [Level.Debug]: 'DEBUG',
  [Level.Info]: 'INFO',
  [Level.Warn]: 'WARN',
  [Level.Error]: 'ERROR',
}

const levelToOriginalMethod: { [key: number]: string } = {
  [Level.Trace]: 'debug',
  [Level.Debug]: 'log',
  [Level.Info]: 'info',
  [Level.Warn]: 'warn',
  [Level.Error]: 'error',
}

export class ConsoleLogger implements ILogger {
  static Level = Level
  protected _level: Level
  protected _logFn: { [key: number]: (message: any, ...args: any[]) => void } = {
    [Level.Trace]: function (message: any, ...args: any[]): void {},
    [Level.Debug]: function (message: any, ...args: any[]): void {},
    [Level.Info]: function (message: any, ...args: any[]): void {},
    [Level.Warn]: function (message: any, ...args: any[]): void {},
    [Level.Error]: function (message: any, ...args: any[]): void {},
  }

  protected _name: string

  constructor ({ name = 'default', level = ConsoleLogger.Level.Info }: { name: string, level: Level }) {
    this._name = name
    this._level = level
    this._logFnFactory({ name: this._name, level: this._level })
  }

  setLevel ({ level }: { level: Level }): void {
    this._level = level
    this._logFnFactory({ name: this._name, level: this._level })
    this._logFn[Level.Info](`Change log level to ${levelToName[level]}`)
  }

  get trace (): (message: any, ...args: any[]) => void {
    return this._logFn[Level.Trace]
  }

  get debug (): (message: any, ...args: any[]) => void {
    return this._logFn[Level.Debug]
  }

  get info (): (message: any, ...args: any[]) => void {
    return this._logFn[Level.Info]
  }

  get warn (): (message: any, ...args: any[]) => void {
    return this._logFn[Level.Warn]
  }

  get error (): (message: any, ...args: any[]) => void {
    return this._logFn[Level.Error]
  }

  protected _logFnFactory ({ name, level }: { name: string, level: Level }): void {
    [Level.Trace, Level.Debug, Level.Info, Level.Warn, Level.Error].forEach((value) => {
      if (Number.isInteger(value)) {
        if (level > value) {
          this._logFn[value] = function (): void {}
        }
        else {
          const method = levelToOriginalMethod[value]
          const levelName = levelToName[value]
          this._logFn[value] = (console as any)[method].bind(console, `[${name}] [${levelName}]`)
        }
      }
    })
  }
}
