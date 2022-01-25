import { CustomError } from 'ts-custom-error'

export { CustomError }

export enum ParamErrorCode {
  Unknown,
  // Common
  PrivateKeyIsInvalid,
  PublicKeyIsInvalid,
  AddressIsInvalid,
  TransactionFormatIsInvalid,
  // Mnemonic
  MnemonicUndefinedLang,
  MnemonicInvalid,
  MnemonicInvalidLength,
  MnemonicInvalidBIP32Path,
  MnemonicUnknownError,
  // BTC
  WIFIsInvalid,
  SignatureLengthInvalid,
  SignatureFlagInvalid,
  TransactionHasNoInputs,
  TransactionSignFailed,
  // CKB
  TransactionCellsNotProvided,
  TransactionMissingPrivateKeyForSomeInputs,
}

export class ParamError extends CustomError {
  protected static messages: { [key: string]: string } = {
    [ParamErrorCode.Unknown]: 'Unknown error',
  }

  public code: ParamErrorCode
  public name = 'ParamError'

  constructor (code: ParamErrorCode, message?: string) {
    super(message)
    this.code = code
  }

  public static fromCode (code: ParamErrorCode, paramName: string): ParamError {
    let message
    if (Object.prototype.hasOwnProperty.call(ParamError.messages, code)) {
      message = `${paramName} ${ParamError.messages[code]}`
    }
    else {
      message = `${paramName} Undefined error`
    }

    return new ParamError(code, message)
  }
}
