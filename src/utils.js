/* eslint-disable import/prefer-default-export */
export function connectToBrocker(brokerUrl, store, delay = 1000) {
  const ws = new WebSocket(brokerUrl);
  setInterval(() => { ws.send('presence'); }, 500);
  ws.onmessage = (msg) => {
    const data = JSON.parse(msg.data);
    store.dispatch('RECEIVE_ACTION', data);
  };
  ws.onclose = () => {
    setTimeout(connectToBrocker, brokerUrl, store, delay, delay * 1.5);
  };
}
