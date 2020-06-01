import { DataTransformer } from '../../src/DataCollectionUtils';

const exampleData = {
  name: {
    first: 'A',
    name: 'B'
  },
  age: 12,
  address: ['address1', 'address2'],
};
const exampleOutData = {
  name: 'A_B',
  age: 12,
  address: 'address1,address2'
}

type Ti = typeof exampleData;
type Oi = typeof exampleOutData;

export interface IInputExampleData extends Ti { }
export interface IOutputExampleData extends Oi { }


const baseTransforms = (utils: DataTransformer<IInputExampleData, IOutputExampleData>) => ([
  utils.useTransform('name', v => {
    const r = v.split("_");
    return {
      first: r[0],
      name: r[1]
    };
  }, ({ first, name }) => first + '_' + name),
  utils.useTransform('address', v => v.split(','), v => v.join(',')),
])


test('emptyDataTransformer', () => {
  const emptyTransformer = new DataTransformer<IInputExampleData, IOutputExampleData>([], [])
  const result = emptyTransformer.toTransform(exampleData);
  expect(result).toEqual({});
})

test('DataTransformer noFilters', () => {
  const transformer = new DataTransformer<IInputExampleData, IOutputExampleData>(
    [],
    ['name', 'age', 'address']
  );
  const result = transformer.toTransform(exampleData)
  expect(result).toEqual(exampleData)
})

test('DataTransformer Corrent Filters', () => {
  const transformer = new DataTransformer<IInputExampleData, IOutputExampleData>(
    baseTransforms,
    ['name', 'age', 'address']
  )
  const input = transformer.fromTransform(exampleOutData);
  expect(input).toEqual(exampleData);
  const output = transformer.toTransform(exampleData);
  expect(output).toEqual(exampleOutData);
});
