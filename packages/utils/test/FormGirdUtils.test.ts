import { getItemContainer, ICommonFormContainerTarget } from '../src';

export function TestFunction(): [any, any, ICommonFormContainerTarget] {
  const testInput = {
    col: 1,
    container: {
      col: { span: 3, lx: 3 },
      label: 5,
      content: 17
    },
    colon: true
  };
  const defaultContainer = {
    labelCol: { span: 4, xl: 6 },
    wrapperCol: { span: 18, xl: 18 },
    col: 3,
    colon: false
  };
  const result = getItemContainer(testInput, defaultContainer, 'colon');
  return [testInput, defaultContainer, result];
}
describe('TypeUtils test', () => {
  const [input, dInput, result] = TestFunction();
  it('safe running', () => {
    expect(input).not.toBe(result);
    expect(dInput).not.toBe(result);
    expect(result.colon).toBe(true);
  });
  it('expect true', () => {
    expect(result).toEqual({
      col: {
        lx: 3,
        span: 1,
      },
      colon: true,
      labelCol: {
        span: 5,
        xl: 6,
      },
      wrapperCol: {
        span: 17,
        xl: 18,
      },
    });
  });
});
