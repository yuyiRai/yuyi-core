
import { Memoize } from 'lodash-decorators';
import { Store } from 'mmlpx';
import { action, observable } from 'mobx';
import * as zango from 'zangodb';
import { DBUtils } from '../utils';

const db = new zango.Db('@yuyi/aul-helper', 1, { 'ExaData': [], 'TrackData': [] });
@Store('GlobalDBManager')
export class DbManager {
  @observable inited: boolean = false;
  @observable isLoading: boolean = false;
  private get db(): zango.Db {
    return db;
  }
  constructor() {
    setTimeout(() => {
      console.log('loading', this)
      const ExaData = this.collection('ExaData')
      // const TrackData = db.collection('TrackData')

      console.log('loaded', ExaData)
      window.temp1 = ExaData
    }, 0);
  }

  @Memoize
  @action collection(name: string) {
    return this.db.collection(name)
  }

  @action queryAll(name: string) {
    this.loading()
    return DBUtils.selectAll(this.collection(name)).finally(this.loaded)
  }

  @action loading(){
    this.isLoading = true;
    return this;
  }
  @action loaded(){
    this.isLoading = false;
    return this;
  }
}