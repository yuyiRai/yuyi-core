import { DataTransformer } from '../../src/DataCollectionUtils';

const Input = {
  other: [],
  date: {
    dateStart: '2018',
    dateEnd: '2019',
  }
};
const Output = {
  other: [],
  dateStart: '2018',
  dateEnd: '2019'
};
const transformer = new DataTransformer<typeof Input, typeof Output>(
  (utils) => {
    return [
      DataTransformer.createMergeTransformer("date", v => v || {}, v => v || {}, ["dateStart", "dateEnd"])
    ];
  },
  ["date", "other"]
);
test('DataTransformer Merge Filters', () => {
  const input = transformer.fromTransform(Output);
  expect(input).toEqual(Input);
  const output = transformer.toTransform(Input);
  expect(output).toEqual(Output);
  expect(Output).toEqual(transformer.exportCache);
  console.log(transformer.exportCache)
});

test('DataTransformer Merge Filters(no clear)', () => {
  const input = transformer.fromTransform(Output, { clearMergeTmp: false });
  expect(input).toEqual({
    ...Output,
    date: {
      dateStart: '2018',
      dateEnd: '2019',
    }
  });
  const output = transformer.toTransform(Input, { clearMergeTmp: false });
  expect(output).toEqual({
    ...Input,
    dateStart: '2018',
    dateEnd: '2019',
  });
  // console.log(transformer.exportCache);
});

test('DataTransformer Merge Filters(full)', () => {
  const input = transformer.fromTransform({
    ...Output,
    testFull: true
  }, { full: true });
  expect(input).toEqual({
    ...Input,
    testFull: true
  });
  const output = transformer.toTransform({
    ...Input,
    testFull: true
  }, { full: true });
  expect(output).toEqual({
    ...Output,
    testFull: true
  });
  // console.log(transformer.exportCache);
});
