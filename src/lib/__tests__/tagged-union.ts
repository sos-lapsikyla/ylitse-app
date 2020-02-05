import * as taggedUnion from '../tagged-union';
import * as remoteData from '../remote-data';

describe('tagged union', () => {
  const okVal = 'Yeah, I am good val!';
  const defaultVal = 'defaultVal';
  it('matches ok things', () => {
    const data = remoteData.ok(okVal) as remoteData.RemoteData<string, number>;
    const result = taggedUnion.match(data, {
      Ok: ({ value }) => value,
      default: () => defaultVal,
    });
    expect(result).toBe(okVal);
  });
  it('default works', () => {
    const data = remoteData.ok(okVal) as remoteData.RemoteData<string, number>;
    const result = taggedUnion.match(data, {
      Err: ({ error }) => `${error}`,
      default: () => defaultVal,
    });
    expect(result).toBe(defaultVal);
  });
});
