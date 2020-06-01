import * as OptionsUtils from "../src/OptionsUtils";
import { getOptionsByLabel, TreeDataUtils } from "../src";

const optionsList = [
  { label: "A", value: "a" },
  { label: "B", value: "b" },
  { label: "C", value: "c" },
  { label: "D", value: "d" },
  { label: "E", value: "e" }
];

/**
 * Dummy test
 */
describe("OptionsUtils test", () => {
  const { Setter, TreeDataUtils, ...o } = OptionsUtils;
  for (const key of Object.keys(o)) {
    it("works if " + key + " is Function", () => {
      expect(o[key]).toBeInstanceOf(Function);
    });
  }
  it("works if getOptionsByLabel is Function", () => {
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

  it("OptionsUtils getOptionsByLabel", () => {
    const findList = getOptionsByLabel(optionsList, "A");
    const findOne = getOptionsByLabel(optionsList, "A", true);
    expect(findList).toBeInstanceOf(Array);
    expect(findList.length).toBe(1);
    expect(findOne).toBeInstanceOf(Object);
    expect(findList[0]).toBe(findOne);
  });
});

describe("Nested-object", () => {
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
    "a.cz", // !invalid
    "a.b.a", // * valid
    "a.b.c", // !invalid
    "b.c", // * valid
    "b.c.d" // * valid
  ];
  expect(TreeDataUtils.getTreeLeafPaths(testObject)).toEqual([
    "a.a",
    "a.b.a",
    "a.c.a",
    "a.c.d",
    "b.c.d"
  ]);
  expect(TreeDataUtils.getTreeLeafPaths(testObject, testPath)).toEqual(["a.b.a", "b.c", "b.c.d"]);
  expect(TreeDataUtils.getTreeLeafs(testObject, testPath)).toEqual([
    ["a.b.a", 1],
    ["b.c", { d: 1 }],
    ["b.c.d", 1]
  ]);

  expect(TreeDataUtils.getTreeLeafs(false)).toEqual([]);
  expect(TreeDataUtils.getTreeLeafs(testObject)).toEqual([
    ["a.a", 2],
    ["a.b.a", 1],
    ["a.c.a", 2],
    ["a.c.d", 4],
    ["b.c.d", 1]
  ]);
  expect(TreeDataUtils.getTreeLeafs(testObject, { deepArray: false, allowPath: null })).toEqual([
    ["a.a", 2],
    ["a.b.a", 1],
    ["a.c.a", 2],
    ["a.c.d", 4],
    ["b.c.d", 1]
  ]);

  expect(TreeDataUtils.getTreeLeafs(testObject, { deepArray: true })).toEqual([
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
  };
  expect(TreeDataUtils.getTreeLeafs(listTestObj, { deepArray: false })).toEqual([
    [
      "list",
      [
        { a: 1, b: [1, 2] },
        { a: 2, b: 3 }
      ]
    ]
  ]);
  expect(TreeDataUtils.getTreeLeafs(listTestObj, { deepArray: true })).toEqual([
    ["list[0].a", 1],
    ["list[0].b[0]", 1],
    ["list[0].b[1]", 2],
    ["list[1].a", 2],
    ["list[1].b", 3]
  ]);

  expect(
    TreeDataUtils.getTreeLeafs(listTestObj, {
      deepArray: true,
      allowPath: ["list[0].b"]
    })
  ).toEqual([["list[0].b", [1, 2]]]);

  expect(
    TreeDataUtils.getTreeLeafs(listTestObj, {
      deepArray: true,
      allowPath: /list\[([0-9]+)\]\.([a-z])/
    })
  ).toEqual([
    ["list[0].a", 1],
    ["list[0].b", [1, 2]],
    ["list[1].a", 2],
    ["list[1].b", 3]
  ]);

  expect(TreeDataUtils.getTreeLeafs({ obj: { 1: 1, 2: 2, c: 3 } }, /^obj\.([0-9]+)$/)).toEqual([
    ["obj.1", 1],
    ["obj.2", 2]
  ]);
  expect(
    TreeDataUtils.getTreeLeafs({ obj: { 1: 1, 2: 2, c: "3" } }, (path, value, key, arrKeys) => {
      return (
        /^obj\.([0-9]+)$/.test(path) && arrKeys.length === 2 && /^[0-9]$/.test(key) && value === 1
      );
    })
  ).toEqual([["obj.1", 1]]);

  expect(
    TreeDataUtils.getTreeLeafs(listTestObj, {
      deepArray: true,
      allowPath: (path, value, key) => {
        return /^list\[([0-9]+)\]\.([a-z])$/.test(path) && typeof value === "number";
      }
    })
  ).toEqual([
    ["list[0].a", 1],
    ["list[1].a", 2],
    ["list[1].b", 3]
  ]);

  expect(
    TreeDataUtils.getTreeLeafs(listTestObj, {
      deepArray: true,
      allowPath: (path, value, key, arrKeys) => arrKeys.length === 3 && /^[0-9]$/.test(arrKeys[1])
    })
  ).toEqual([
    ["list[0].a", listTestObj.list[0].a],
    ["list[0].b", listTestObj.list[0].b],
    ["list[1].a", listTestObj.list[1].a],
    ["list[1].b", listTestObj.list[1].b]
  ]);
  expect(
    TreeDataUtils.getTreeLeafPaths(listTestObj, {
      deepArray: true,
      allowPath: (path, value, key, arrKeys) => arrKeys.length === 3 && /^[0-9]$/.test(arrKeys[1])
    })
  ).toEqual(["list[0].a", "list[0].b", "list[1].a", "list[1].b"]);

  expect(
    TreeDataUtils.getTreeLeafs(listTestObj, {
      deepArray: true,
      allowPath: { list: true }
    })
  ).toEqual([["list", listTestObj.list]]);

  expect(
    TreeDataUtils.getTreeLeafs(listTestObj, {
      deepArray: true,
      allowPath: { "list[0].b": true }
    })
  ).toEqual([["list[0].b", listTestObj.list[0].b]]);

  const TreeOptions = {
    key: "a",
    value: 1,
    children: [
      { key: 1, value: 2 },
      { key: 1, value: 3 },
      {
        key: 2,
        value: 4,
        children: [
          { key: 1, value: 2 },
          { key: 1, value: 3 },
        ]
      }
    ]
  };
  expect(
    TreeDataUtils.getTreeLeafs(TreeOptions, {
      nodeOptions: {
        key: "key"
      }
    })
  ).toEqual([
    ["a", TreeOptions],
    ["a.1", TreeOptions.children[1]],
    ["a.2", TreeOptions.children[2]],
    ["a.2.1", TreeOptions.children[2].children[1]]
  ]);
  // 直接遍历children
  expect(
    TreeDataUtils.getTreeLeafs(TreeOptions.children, {
      nodeOptions: {
        key: "key"
      }
    })
  ).toEqual([
    ["1", TreeOptions.children[1]],
    ["2", TreeOptions.children[2]],
    ["2.1", TreeOptions.children[2].children[1]]
  ]);
  // 直接遍历children
  expect(
    TreeDataUtils.getTreeLeafsAndParents(TreeOptions.children, {
      nodeOptions: {
        key: "key"
      }
    })
  ).toEqual([
    ["1", TreeOptions.children[1], undefined],
    ["2", TreeOptions.children[2], undefined],
    ["2.1", TreeOptions.children[2].children[1], '2']
  ]);
  expect(
    TreeDataUtils.getTreeLeafsAndParentsPath(TreeOptions.children, {
      nodeOptions: {
        key: "key"
      }
    })
  ).toEqual({
    "1": undefined,
    "2": undefined,
    "2.1": '2'
  });
  // 指定value的key
  expect(
    TreeDataUtils.getTreeLeafs(TreeOptions, {
      nodeOptions: {
        key: "key",
        value: "value"
      }
    })
  ).toEqual([
    ["a", TreeOptions.value],
    ["a.1", TreeOptions.children[1].value],
    ["a.2", TreeOptions.children[2].value],
    ["a.2.1", TreeOptions.children[2].children[1].value]
  ]);
  expect(
    TreeDataUtils.getTreeLeafs(
      { a: { b: { c: 1 } } },
      {
        deepArray: false,
        allowPath: { "a.b": true }
      }
    )
  ).toEqual([["a.b", { c: 1 }]]);
});
