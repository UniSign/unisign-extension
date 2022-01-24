// todo: this is a fork of webext-bridge, fixing a bug relative to webextension-polyfill included by webext-bridge
import { onMessage, sendMessage, allowWindowMessaging, setNamespace } from '../../libs/webext-bridge'

// there is bug with crx-bridge@3.0 and webext-bridge according to the issue below
// https://github.com/zikaari/crx-bridge/issues/11

// there is also bug with crx-bridge@2.2 now, which will incorrectly consider the popup as background.

export const messageBridge = {
  send: sendMessage,
  on: onMessage,

  // this can only be invoked in content-script context
  allowWindowMessaging: () => allowWindowMessaging('unisign-extension-provider'),
  // this can only be invoked in window context
  setNamespace: () => setNamespace('unisign-extension-provider'),
}

export * from '../../libs/webext-bridge'
