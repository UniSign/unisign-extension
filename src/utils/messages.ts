import { onMessage, sendMessage, allowWindowMessaging, setNamespace } from 'webext-bridge'

// there is bug with crx-bridge@3.0 and webext-bridge according to the issue below
// https://github.com/zikaari/crx-bridge/issues/11

// there is also bug with crx-bridge@2.2 now, which will incorrectly consider the popup as background.

// todo: no perfect solution, we can only find a better solution later
export const messageBridge = {
  send: sendMessage,
  on: onMessage,

  // this can only be invoked in content-script context
  allowWindowMessaging: () => allowWindowMessaging('unisign-extension-provider'),
  // this can only be invoked in window context
  setNamespace: () => setNamespace('unisign-extension-provider'),
}

export * from 'webext-bridge'
