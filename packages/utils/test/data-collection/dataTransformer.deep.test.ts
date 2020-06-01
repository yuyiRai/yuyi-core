import { IConvertDataOptions, DataTransformer, convertDataMap } from "../../src/DataCollectionUtils";

function testReserveResult(source: any, options: IConvertDataOptions<any, any>) {
  const result = convertDataMap(source, {
    keyTransform: DataTransformer.formatCode,
    ...options
  });
  const reserveResult = convertDataMap(result, {
    keyTransform: DataTransformer.getDataCode,
    ...options
  });
  return [result, reserveResult];
}
const imported = {
  other_$_$_a: [],
  coreData_$_$_date: {
    dateStart: "2018",
    dateEnd: "2019"
  }
};
const exported = {
  other: { a: [] },
  coreData: {
    dateStart: "2018",
    dateEnd: "2019"
  }
};
const defaultValues = {
  'coreData.date': {
    dateStart: "2018",
    dateEnd: "2019"
  }
}
const transformer = new DataTransformer<typeof imported, typeof exported>(
  utils => {
    return [
      DataTransformer.createMergeTransformer(
        "coreData.date",
        v => v || {},
        v => v || {},
        ["dateStart", "dateEnd"]
      )
    ];
  },
  ["coreData.date", "other.a"]
);
test("DataTransformer Deep Filters", () => {
  const input = transformer.fromTransform(exported);
  expect(input).toEqual(imported);
  const output = transformer.toTransform(imported);
  expect(output).toEqual(exported);
  console.log(transformer.exportCache, exported);
});
test("DataTransformer Deep Filters2", () => {
  const input = transformer.toTransform({} as any);
  expect(input).toMatchSnapshot();
  const output = transformer.fromTransform({
    other: { a: [] },
    coreData: { } as any
  }, {
      getDefaultValue: key => defaultValues[key]
  });
  expect(output).toMatchSnapshot();
});

test("DataTransformer Convert Simple", () => {
  const result1 = {
    "coreData_$_$_dateEnd": "2019",
    "coreData_$_$_dateStart": "2018",
  };
  expect(convertDataMap(exported, {
    keyTransform: DataTransformer.formatCode
  })).toEqual(result1);
  const result2 = ({
    "coreData_$_$_dateEnd": "2019",
    "coreData_$_$_dateStart": "2018",
    "other_$_$_a": []
  });

  expect(convertDataMap({ ...exported }, {
    keyTransform: DataTransformer.formatCode,
    deepArraySearch: false
  })).toEqual(result2);


  expect(convertDataMap(exported as any, {
    keyTransform: DataTransformer.formatCode,
    filterCodes: ['other.a', 'coreData.dateEnd', 'coreData.dateStart']
  })).toEqual(result2);

  expect(convertDataMap(result2, {
    keyTransform: DataTransformer.getDataCode,
    deepArraySearch: false
  })).toEqual(exported);

  expect(convertDataMap(result1, {
    keyTransform: DataTransformer.getDataCode
  })).toEqual({
    coreData: exported.coreData
  });
});

describe("convertDataMap 设置cleanUnusedKey与否的区别", () => {
  const testData = {
    ...exported, test: {
      testUndefined: undefined, testNull: null
    }
  };
  it("convertDataMap 不设置cleanUnusedKey 完全保留undefined的字段", () => {
    const [result, reserveResult] = testReserveResult(testData, {
      deepArraySearch: false,
      catchInvaildKey: false
    })
    expect(result).toMatchSnapshot();
    expect(reserveResult).toMatchSnapshot();
    expect(reserveResult).toEqual(testData)
    expect(reserveResult).toStrictEqual(testData)
  });
  it("convertDataMap 设置cleanUnusedKey为true 删除值为undefined的字段", () => {
    const [result, reserveResult] = testReserveResult(testData, {
      deepArraySearch: false,
      catchInvaildKey: true
    });
    expect(result).toMatchSnapshot();
    expect(reserveResult).toMatchSnapshot();
    expect(reserveResult).toEqual(testData)
    expect(reserveResult).not.toStrictEqual(testData)
  });
  let log = []
  it("convertDataMap 设置cleanUnusedKey，如果value为null|undefined则视作不用的字段进行清理", () => {
    const [result, reserveResult] = testReserveResult(testData, {
      deepArraySearch: false,
      catchInvaildKey: (value, sourceKey, targetKey) => {
        log.push([value, sourceKey, targetKey]);
        return value === null || value === undefined;
      }
    });
    expect(result).toMatchSnapshot();
    expect(reserveResult).toMatchSnapshot();
    expect(reserveResult).not.toEqual(testData);
    expect(reserveResult).not.toStrictEqual(testData)
  })
  it("使用log记录", () => {
    expect(log).toMatchSnapshot()
  })
})
