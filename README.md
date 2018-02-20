# mdns-resolver

A Node.js module to resolve zeroconf .local domains using pure JavaScript.

## Usage

```js
const mdnsResolver = require('mdns-resolver')

mdnsResolver.resolve('hostname.local', 'A')
  .then(console.log)
  // 192.168.1.28

mdnsResolver.resolve4('hostname.local')
  .then(console.log)
  // 192.168.1.28

mdnsResolver.resolve6('hostname.local')
  .then(console.log)
  // fe80::20c:29ff:fea5:99f6
```