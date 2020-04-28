import * as OptionsUtils from '../src/OptionsUtils';
import { getOptionsByLabel } from '../src';

const optionsList = [
  { label: 'A', value: 'a' },
  { label: 'B', value: 'b' },
  { label: 'C', value: 'c' },
  { label: 'D', value: 'd' },
  { label: 'E', value: 'e' }
];

/**
 * Dummy test
 */
describe('OptionsUtils test', () => {
  const { Setter, ...o } = OptionsUtils;
  for (const key of Object.keys(o)) {
    it('works if ' + key + ' is Function', () => {
      expect(o[key]).toBeInstanceOf(Function);
    });
  }
  it('works if getOptionsByLabel is Function', () => {
    expect(OptionsUtils.convertValueOption([1, 2, 3, 4, 5])).toMatchInlineSnapshot(`
                  Array [
                    Object {
                      "value": "1",
                    },
                    Object {
                      "value": "2",
                    },
                    Object {
                      "value": "3",
                    },
                    Object {
                      "value": "4",
                    },
                    Object {
                      "value": "5",
                    },
                  ]
            `);
  });

  it('OptionsUtils getOptionsByLabel', () => {
    const findList = getOptionsByLabel(optionsList, 'A');
    const findOne = getOptionsByLabel(optionsList, 'A', true);
    expect(findList).toBeInstanceOf(Array);
    expect(findList.length).toBe(1);
    expect(findOne).toBeInstanceOf(Object);
    expect(findList[0]).toBe(findOne);
  });
});

describe('Nested-object', () => {
  var testObject = {
    a: {
      a: 2,
      b: {
        a: 1
      },
      c: {
        a: 2,
        d: 4
      }
    },
    b: {
      c: {
        d: 1
      }
    }
  };
  const testPath = [
    'a.cz', // !invalid
    'a.b.a', // * valid
    'a.b.c', // !invalid
    'b.c', // * valid
    'b.c.d' // * valid
  ];
  expect(OptionsUtils.getValuePath(testObject)).toEqual([
    "a.a",
    "a.b.a",
    "a.c.a",
    "a.c.d",
    "b.c.d",
  ]);
  expect(OptionsUtils.getValuePath(testObject, testPath)).toEqual([
    "a.b.a",
    "b.c",
    "b.c.d"
  ]);
  expect(OptionsUtils.getValueAndPath(testObject, testPath)).toEqual([
    ["a.b.a", 1],
    ["b.c", { "d": 1, }],
    ["b.c.d", 1]
  ]);

  expect(OptionsUtils.getValueAndPath(false)).toEqual([]);
  expect(OptionsUtils.getValueAndPath(testObject)).toEqual([
    ["a.a", 2],
    ["a.b.a", 1],
    ["a.c.a", 2],
    ["a.c.d", 4],
    ["b.c.d", 1]
  ]);
  expect(OptionsUtils.getValueAndPath(testObject, { commlizeArray: false, allowPath: null })).toEqual([
    ["a.a", 2],
    ["a.b.a", 1],
    ["a.c.a", 2],
    ["a.c.d", 4],
    ["b.c.d", 1]
  ]);


  expect(OptionsUtils.getValueAndPath(testObject, { commlizeArray: true })).toEqual([
    ["a.a", 2],
    ["a.b.a", 1],
    ["a.c.a", 2],
    ["a.c.d", 4],
    ["b.c.d", 1]
  ]);

  var listTestObj = {
    list: [
      { a: 1, b: [1, 2] },
      { a: 2, b: 3 }
    ]
  }
  expect(OptionsUtils.getValueAndPath(listTestObj, { commlizeArray: false })).toEqual([
    ["list", [
      { a: 1, b: [1, 2] },
      { a: 2, b: 3 }
    ]]
  ]);
  expect(OptionsUtils.getValueAndPath(listTestObj, { commlizeArray: true })).toEqual([
    ["list[0].a", 1],
    ["list[0].b[0]", 1],
    ["list[0].b[1]", 2],
    ["list[1].a", 2],
    ["list[1].b", 3],
  ]);

  expect(OptionsUtils.getValueAndPath(listTestObj, {
    commlizeArray: true, allowPath: ['list[0].b']
  })).toEqual([
    ["list[0].b", [1, 2]]
  ]);
  
  expect(OptionsUtils.getValueAndPath(listTestObj, {
    commlizeArray: true,
    allowPath: /list\[([0-9]+)\]\.([a-z])/
  })).toEqual([
    ["list[0].a", 1],
    ["list[0].b", [1, 2]],
    ["list[1].a", 2],
    ["list[1].b", 3],
  ]);

  expect(OptionsUtils.getValueAndPath(listTestObj, {
    commlizeArray: true,
    allowPath: (path, value, key) => {
      return /list\[([0-9]+)\]\.([a-z])$/.test(path) && typeof value === 'number'
    }
  })).toEqual([
    ["list[0].a", 1],
    ["list[1].a", 2],
    ["list[1].b", 3],
  ]);

  expect(OptionsUtils.getValueAndPath(listTestObj, {
    commlizeArray: true,
    allowPath: (path, value, key, arrKeys) => {
      return arrKeys.length === 3;
    }
  })).toEqual([
    ["list[0].a", listTestObj.list[0].a],
    ["list[0].b", listTestObj.list[0].b],
    ["list[1].a", listTestObj.list[1].a],
    ["list[1].b", listTestObj.list[1].b],
  ]);

  expect(OptionsUtils.getValueAndPath(listTestObj, {
    commlizeArray: false,
    allowPath: { 'list': true }
  })).toEqual([
    ["list", listTestObj.list]
  ]);

  expect(OptionsUtils.getValueAndPath(listTestObj, {
    commlizeArray: true,
    allowPath: { 'list[0].b': true }
  })).toEqual([
    ["list[0].b", listTestObj.list[0].b]
  ]);


  expect(OptionsUtils.getValueAndPath({ a: { b: { c: 1 }}}, {
    commlizeArray: false,
    allowPath: { 'a.b': true }
  })).toEqual([
    ["a.b", { c: 1 }]
  ]);
});
