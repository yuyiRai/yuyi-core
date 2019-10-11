export function createTsxStory(c: any) {
  const { render } = c
  if (render) {
    return () => ({
      ...c,
      render(h) {
        // debugger
        return this ? render.call(this, h) : h('a', {}, [])
      }
    })
  }
  return () => c
}
export interface OptionsParameter extends Object {
  storySort?: any;
  hierarchyRootSeparator?: string;
  hierarchySeparator?: RegExp;
  theme?: {
    base: string;
    brandTitle?: string;
  };
  [key: string]: any;
}
export interface Parameters {
  fileName?: string;
  options?: OptionsParameter;
  [key: string]: any;
}

export const storyOf = (storyName: string, innerModule?: any) => {
  return new StoryLoader(storyName, innerModule);
}
export default storyOf
export class StoryLoader {
  constructor(public name: string, public innerModule) { }
  list: ([string, (() => any), Parameters])[] = [];
  params: Parameters[] = [];
  decorators: any[] = [];
  addDecorator(decorator: any) {
    this.decorators.push(decorator)
    return this
  }
  public addParameters(param: Parameters) {
    this.params.push(param)
    return this
  }
  public add(storyName: string, storyFn: () => any, parameters?: Parameters) {
    this.list.push([storyName, (...args) => {
      const c = storyFn(...args);
      const { render } = c
      if (render) {
        return {
          ...c,
          render(h) {
            // debugger
            return this ? render.call(this, h) : h('a', {}, [])
          }
        }
      }
      return c
    }, parameters]);
    return this;
  }
  public install(storiesOf: any) {
    let story = storiesOf(this.name, this.innerModule || module)
    if (this.params.length > 0) {
      story = this.params.reduce((b, o) => b.addParameters(o), story)
    };
    if (this.decorators.length > 0) {
      story = this.decorators.reduce((b, o) => b.addDecorator(o), story)
    };
    return this.list.reduce((b, o) => b.add(...o), story);
  }
}
