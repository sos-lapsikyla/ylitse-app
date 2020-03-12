import combineSelectors from '../combineSelectors';

describe('combineSelectors', () => {
  it('combines', () => {
    type State = {
      num: number;
      str: string;
    };
    const state: State = {
      num: 1,
      str: 'a',
    };
    const selectNum = ({ num }: State) => num;
    const selectStr = ({ str }: State) => str;
    const foo = combineSelectors(state, {
      str: selectStr,
      num: selectNum,
    });
    const stringValue: string = foo.str;
    expect(stringValue).toEqual(state.str);
    const numValue: number = foo.num;
    expect(numValue).toEqual(state.num);
  });
});
