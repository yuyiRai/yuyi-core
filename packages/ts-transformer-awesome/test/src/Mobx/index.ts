import { observable, computed, action, autorun } from 'mobx';
import { autobind, readonly } from 'core-decorators';

export class App {
  constructor() {
    autorun(() => {
      console.log(this.app)
    })
  }
  @observable @readonly
  private app: number = 0;
  @observable.ref app3: string = '';
  @computed get app2() {
    return this.app + 2;
  }
  // @autobind
  @action
  setApp(v: number) {
    this.app = v;
  }
  @action
  setApp2(v: App) {
  }
}

Object.defineProperty(App, 'app', {})

export class TApp {
  @observable app: number = 0;
}

export function ccc () {
  class App2 {
    @observable app: string = '';
    @observable.ref app3: string = '';
    @computed get app2() {
      return this.app + 2;
    }
    @action
    setApp() {
      this.app = '';
    }
  }
  return App2 as any
}

const app = new App();
app.setApp(2);
console.log(app.app2);
