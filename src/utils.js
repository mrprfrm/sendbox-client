/* eslint-disable import/prefer-default-export */
import ReconnectingWebSocket from 'reconnecting-websocket';

export function connectToBrocker(brokerUrl, store, delay = 1000) {
  const ws = new ReconnectingWebSocket(brokerUrl);
  setInterval(() => { ws.send('presence'); }, 500);
  ws.addEventListener('message', (msg) => {
    const data = JSON.parse(msg.data);
    store.dispatch('RECEIVE_ACTION', data);
  });
}
