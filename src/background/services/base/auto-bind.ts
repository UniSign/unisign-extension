import autoBind from 'auto-bind'

export class AutoBindService {
  constructor () {
    autoBind(this)
  }
}
