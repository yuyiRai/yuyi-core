import { EventEmitter, BehaviorEventEmitter, ReplayEventEmitter, sleep } from '../../src';
test('EventEmitter 基本使用', () => {
  const log = [];
  const emitter = new EventEmitter();
  const mockObserver = jest.fn(v => log.push(v));
  emitter.subscribe({ next: mockObserver, complete: () => mockObserver(100) });
  emitter.subscribe(mockObserver);
  emitter.emit(123);
  mockObserver(456);
  emitter.dispose();
  expect(log).toEqual([123, 123, 456, 100]);
  expect(mockObserver).toBeCalledTimes(4);

});

test('EventEmitter 错过订阅的发送值', () => {
  const log = [];
  const emitter = new EventEmitter();
  const mockObserver = jest.fn(v => log.push(v));
  emitter.emit(123);
  emitter.subscribe(mockObserver);
  mockObserver(456);
  expect(log).toEqual([
    456
  ]);
  expect(mockObserver).toBeCalledTimes(1);

});

test('BehaviorEventEmitter 基本使用', () => {
  const emitter = new BehaviorEventEmitter(0); // 0是初始值
  const result = []
  emitter.subscribe({
    next: (v) => result.push('observerA: ' + v)
  });
  emitter.emit(1);
  emitter.emit(2);
  emitter.subscribe({
    next: (v) => result.push('observerB: ' + v)
  });
  emitter.emit(3);
  expect(result).toEqual([
    'observerA: 0',
    'observerA: 1',
    'observerA: 2',
    'observerB: 2',
    'observerA: 3',
    'observerB: 3'
  ])
});

test('ReplayEventEmitter 基本使用', () => {
  const emitter = new ReplayEventEmitter(3); // 为新的订阅者缓冲3个值
  const result = []
  emitter.subscribe({
    next: (v) => result.push('observerA: ' + v)
  });

  emitter.emit(1);
  emitter.emit(2);
  emitter.emit(3);
  emitter.emit(4);

  emitter.subscribe({
    next: (v) => result.push('observerB: ' + v)
  });

  emitter.emit(5);
  expect(result).toEqual([
    'observerA: 1',
    'observerA: 2',
    'observerA: 3',
    'observerA: 4',
    'observerB: 2',
    'observerB: 3',
    'observerB: 4',
    'observerA: 5',
    'observerB: 5',
  ])
});

test(`ReplayEventEmitter 时间限制缓存`, async () => {
  const emitter = new ReplayEventEmitter(100, 600 /* windowTime */);
  const result = [];
  emitter.subscribe({
    next: (v) => result.push('observerA: ' + v)
  });
  var i = 1;
  emitter.emit(i)
  setInterval(() => emitter.emit(++i), 200);

  setTimeout(() => {
    emitter.subscribe({
      next: (v) => result.push('observerB: ' + v)
    });
  }, 1000);
  
  await sleep(1200)
  expect(result).toEqual([
    'observerA: 1', // 0ms
    'observerA: 2', // 200ms
    'observerA: 3', // 400ms
    'observerA: 4', // 600ms
    'observerA: 5', // 800ms
    'observerB: 3', // 1000ms - 400 = 600
    'observerB: 4', // 1000ms - 600 = 400
    'observerB: 5', // 1000ms - 800 = 200
    'observerA: 6', // 1000ms
    'observerB: 6', // 1000ms
  ]);
});
