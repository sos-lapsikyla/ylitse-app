import * as taggedUnion from '../tagged-union';
import * as remoteData from '../remote-data';

describe('tagged union', () => {
  const okVal = 'Yeah, I am good val!';
  const defaultVal = 'defaultVal';
  test('matches ok things', () => {
    const data = remoteData.ok(okVal) as remoteData.RemoteData<string, number>;
    const result = taggedUnion.match(data, {
      Ok: ({ value }) => value,
      default: () => defaultVal,
    });
    expect(result).toBe(okVal);
  });
  test('default works', () => {
    const data = remoteData.ok(okVal) as remoteData.RemoteData<string, number>;
    const result = taggedUnion.match(data, {
      Err: ({ error }) => `${error}`,
      default: () => defaultVal,
    });
    expect(result).toBe(defaultVal);
  });
  describe('mix of objects and functions', () => {
    test('matched is object', () => {
      const data = remoteData.ok(okVal) as remoteData.RemoteData<
        string,
        number
      >;
      const result = taggedUnion.match(data, {
        Ok: 'OK THINGY',
        Err: ({ error }) => `${error}`,
        default: () => defaultVal,
      });
      expect(result).toBe('OK THINGY');
    });
    test('matched is function', () => {
      const data = remoteData.ok(okVal) as remoteData.RemoteData<
        string,
        number
      >;
      const result = taggedUnion.match(data, {
        Ok: ({ value }) => value,
        Err: 'juuh jooh',
        default: () => defaultVal,
      });
      expect(result).toBe(okVal);
    });
    test('default is object', () => {
      const data = remoteData.notAsked as remoteData.RemoteData<string, number>;
      const result = taggedUnion.match(data, {
        Ok: ({ value }) => value,
        Err: 'juuh jooh',
        default: defaultVal,
      });
      expect(result).toBe(defaultVal);
    });
  });
});
