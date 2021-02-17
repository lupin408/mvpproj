const openpgp = require('openpgp');
const Promise = require('bluebird');


const makekeys = Promise.promisifyAll(openpgp);


makekeys.generateKey({
    userIds: [{ name: 'Jon Smith', email: 'jon@example.com' }], // you can pass multiple user IDs
    rsaBits: 4096,                                              // RSA key size
    passphrase: 'super long and hard to guess secret'           // protects the private key
})


module.exports = {
    makekeys,
  };
  