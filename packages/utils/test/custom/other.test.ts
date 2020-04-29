import { autoBindObj } from "../../src";

test('autoBindObj', () => {
  const logger = jest.fn(console.log)
  const Logger = {
    core: logger,
    log(message: string) {
      this.core(message);
    }
  }
  const { log } = autoBindObj(Logger);
  log('hello world')

  expect(logger).toBeCalledTimes(1)
})
