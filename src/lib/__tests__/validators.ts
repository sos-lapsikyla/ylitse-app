import { right, left, isRight, isLeft } from 'fp-ts/lib/Either';

import * as validators from '../validators';

import { describe, expect, it } from '@jest/globals';

describe('unixTimeFromDateString', () => {
  it('decodes js date iso string', () => {
    const s = '2020-01-16T10:29:32.350430+00:00';
    expect(validators.unixTimeFromDateString.decode(s)).toEqual(
      right(new Date(s).getTime()),
    );
  });
  it('fails to decode random string', () => {
    expect(validators.unixTimeFromDateString.decode('foo')).toEqual(
      left(expect.any(Array)),
    );
  });
});

describe('validateEmail', () => {
  [
    'plainaddress',
    '#@%^%#$@#$@#.com',
    '@example.com',
    'Joe Smith <email@example.com>',
    'email.example.com',
    'email@example@example.com',
    'あいうえお@example.com',
    'email@example.com (Joe Smith)',
    'email@example',
    'email@111.222.333.44444',
    'a',
    `${'x'.repeat(400)}@example.org`,
  ].forEach(invalidEmail => {
    it(`fails to decode invalid address ${invalidEmail}`, () => {
      expect(isLeft(validators.ValidEmail.decode(invalidEmail))).toEqual(true);
    });
  });

  [
    '',
    'email@example.com',
    'firstname.lastname@example.com',
    'email@subdomain.example.com',
    'firstname+lastname@example.com',
    '1234567890@example.com',
    'email@example-one.com',
    '_______@example.com',
    'email@example.name',
    'email@example.museum',
    'email@example.co.jp',
    'firstname-lastname@example.com',
    "!#$%&'*+-/=?^_`.{|}~@kebab.fi",
    `${'x'.repeat(63)}@${'e'.repeat(191)}.${'f'.repeat(62)}`,
  ].forEach(validEmail => {
    it(`decodes valid email address ${validEmail}`, () => {
      expect(isRight(validators.ValidEmail.decode(validEmail))).toEqual(true);
    });
  });
});

describe('Validate The valid displayName to be true', () => {
  [
    'Ähtö',
    'Aki',
    'Äteritsiputeritsipuolilautatsijänkä',
    'Veera',
    'Ivan',
    'eppu',
    'feelix',
    'pyry',
  ].forEach(validName => {
    it(`decodes valid displayName ${validName}`, () => {
      expect(isRight(validators.ValidName.decode(validName))).toEqual(true);
    });
  });
});

describe('Validate The invalid displayName to be true', () => {
  [
    'Ähtö@',
    'Aki©',
    'Äteritsiputeritsipuolilautatsijänkädsadasd',
    'Veera..',
    'Ivan)',
    'eppu=',
    'feelix!"',
    'pyry!"#',
  ].forEach(invalidName => {
    it(`decodes valid displayName ${invalidName}`, () => {
      expect(isLeft(validators.ValidName.decode(invalidName))).toEqual(true);
    });
  });
});

describe('Validate The valid password to be true', () => {
  [
    'p5%Kyopup2',
    '40kvR#;rrvaaA',
    'ÄteritsiputeRitsipuolilautatsijänk*ä',
    'Pf0)k30kfx',
    'PassPass!',
  ].forEach(password => {
    it(`decodes valid password ${password}`, () => {
      expect(isRight(validators.ValidPassword.decode(password))).toEqual(true);
    });
  });
});

describe('Validate The invalid password', () => {
  [
    '',
    'password22',
    'PasswordSalasana',
    'ÄteritsiputeRitsipuolilautatsijänk',
  ].forEach(password => {
    it(`decodes inValid password ${password}`, () => {
      expect(isLeft(validators.ValidPassword.decode(password))).toEqual(true);
    });
  });
});

describe('Validate correct versions', () => {
  ['1.23.3', '10.20.0', '3.99.99', '2.11.1'].forEach(version => {
    it(`decodes valid  version ${version}`, () => {
      expect(isRight(validators.ValidVersion.decode(version))).toEqual(true);
    });
  });
});

describe('Validate invalid versions', () => {
  [
    '1.2',
    '1.2.3.4',
    '123.45.6',
    '1.234.5',
    '01.2.3',
    '1.2.03',
    'a.b.c',
    '1.2.a',
    '',
    '1..2',
    '.1.2.3',
    '1.2.3.',
    '1.2.',
    '1..',
    '1',
    null,
    undefined,
    123,
    {},
  ].forEach(version => {
    it(`invalidates invalid version ${version}`, () => {
      expect(isLeft(validators.ValidVersion.decode(version))).toEqual(true);
    });
  });
});
