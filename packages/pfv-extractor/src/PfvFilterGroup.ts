import { autorun, computed, observable, toJS } from 'mobx';
import { sortBy } from 'lodash'
export class PfvFilterGroup {
  @observable
  private source: string[][];
  @observable
  private Params: {
    [key: string]: string[];
  };
  private $name: string | undefined;
  constructor(array: string[][], name?: string) {
    this.source = array;
    this.$name = name;
    autorun(() => {
      this.Params = this.params;
    });
  }
  @computed
  public get filter(): string[] {
    return this.source[0];
  }
  @computed
  public get name(): string {
    return this.$name || '';
  }
  @computed
  public get children(): ParamOptions[] {
    const [top, ...children] = this.source;
    return children.map(child => new ParamOptions(child, this.filter));
  }

  @computed
  public get childrenList(): string[] {
    const [top, ...children] = this.source;
    const toSort: [number, string][] = children.map((c = [], index) => [index, c[0]]).filter(i => i && i[1]) as [number, string][]

    return toSort.sort((a, b) => b[0] - a[0]).map(r => r[1]);
  }

  @computed
  public get params(): {
    [key: string]: string[];
  } {
    return convertArrayToObjectByKey(this.children, obj => obj.name.replace(`//${this.name}/`, ''), 'children');
  }
}
export interface IPfvFilterGroupMap {
  [key: string]: PfvFilterGroup;
}

export function convertArrayToObjectByKey(list: any[], key: string | ((obj: any) => string), innerValueKey?: string): any {
  return [{}].concat(list).reduce((obj, item) => ({ ...obj, [typeof key == 'string' ? item[key] : key(item)]: innerValueKey ? item[innerValueKey] : item }))
}


export class ParamOptions {
  @observable private source: string[]
  @observable private filters: string[]
  constructor(source: string[], filters: string[]) {
    this.source = source;
    this.filters = filters;
  }
  @computed public get name() {
    return this.source[0]
  }

  @computed private get sourceChildren() {
    const [name, ...children] = this.source
    return children;
  }

  @computed public get children() {
    return this.sourceChildren.filter(child => {
      if (this.filters.some(filter => child.indexOf(filter) > -1)) {
        return true
      } else {
        return false
      }
    })
  }
}
