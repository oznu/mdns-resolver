'use strict';

import * as util from 'util';
import * as MDNS from 'multicast-dns';

const resolver = (hostname, rrtype, callback) => {
  const mdns = MDNS();

  if (hostname.charAt(hostname.length - 1) === '.') {
    hostname = hostname.substring(0, hostname.length - 1)
  }

  const timeoutHandler = setTimeout(() => {
    clearInterval(retryHandler);

    mdns.removeListener('response', responseHandler);
    mdns.destroy();

    callback(new Error(`Could not resolve ${hostname} - Query Timed Out`))
  }, 3000);

  const retryHandler = setInterval(() => {
    mdns.query(hostname, rrtype);
  }, 500);

  const responseHandler = (response) => {
    const answer = response.answers.find(x => x.name === hostname && x.type === rrtype);

    if (answer) {
      clearTimeout(timeoutHandler);
      clearInterval(retryHandler);

      mdns.removeListener('response', responseHandler);
      mdns.destroy();

      callback(null, answer.data);
    }
  }

  mdns.on('response', responseHandler);
  mdns.query(hostname, rrtype);
}

export const resolve = util.promisify(resolver);
export const resolve4 = (hostname, callback) => resolve(hostname, 'A')
export const resolve6 = (hostname, callback) => resolve(hostname, 'AAAA')