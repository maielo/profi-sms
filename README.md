## profi-sms

- node.js client for [profisms.cz](https://profisms.cz/)
  - normalizing phone number strings
  - handling authentication
- documentation http://document.profisms.cz/

#### Usage

```js
// commonJS
const ProfiSms = require('profi-sms').default;
// ES6 modules
import ProfiSms from 'profi-sms';

const sms = new ProfiSms({
  login: 'myLogin',
  password: 'myPassword',
  source: 'mySourceAccount',
});

// ...
try {
  await sms.send({
      tels: ['555444333', '555 444 333'],
      text: 'test',
  });
} catch (err) {

  console.error(err);
}

```
