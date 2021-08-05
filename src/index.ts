import request from 'request';
import md5 from 'md5';

export type ProfiSmsConstructor = {
  login: string;
  password: string;
  source: string;
};

export default class ProfiSms {
  config: {
    CTRL: 'sms';
    _login: string;
    _service: 'sms';
    source: string;
  };
  pswd: string;

  constructor({ login, password, source }: ProfiSmsConstructor) {
    this.config = {
      CTRL: 'sms',
      _login: login,
      _service: 'sms',
      source,
    };

    this.pswd = password;
  }
  private normalizePhoneNumber(number: string) {
    return number.replace(/\s|\(|\)|-/g, '');
  }

  private getTelString(tels: string[]) {
    const that = this;
    return tels
      .reduce((result, value) => {
        if (value) {
          const _value = that.normalizePhoneNumber(value);
          // @ts-ignore
          result.push(_value);
        }

        return result;
      }, [])
      .join(','); // // format must be string separated by coma
  }

  public send({ text, tels }: { text: string; tels: string[] }) {
    if (!text) {
      throw new Error('ProfiSms.send ~ text is mandatory');
    }

    if (!tels || !tels.length) {
      throw new Error(
        'ProfiSms.send ~ tels array of phone numbers is mandatory'
      );
    }

    const call = new Date().getTime();
    const password = md5(md5(this.pswd) + call);
    const _tels = this.getTelString(tels);
    const _config = {
      ...this.config,
      text,
      msisdn: _tels,
      _call: `${call}`,
      _password: password,
    };

    const queryString = new URLSearchParams(_config).toString();

    return new Promise((resolve, reject) => {
      request(
        `https://api.profisms.cz/index.php?${queryString}`,
        { json: true },
        // @ts-ignore
        (err, res, body) => {
          if (err && body.error) {
            return reject(body.error);
          }

          return resolve(body);
        }
      );
    });
  }
}
