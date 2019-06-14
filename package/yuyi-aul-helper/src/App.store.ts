import { ViewModel, inject, onSnapshot, getSnapshot, applySnapshot, Store } from "mmlpx";
import { ExoUtils } from "./utils/ExoUtils";
import { DbManager } from "./DAT";
import { settingLf } from "./utils/Setting";
import { IReactionDisposer, observable, action, runInAction } from "mobx";
import { Snapshot } from "mmlpx/esm/core/dependency-inject/Injector";
import { Utils } from "yuyi-core-utils";

let staticReactional: IReactionDisposer | null = null;
let defaultSnapshot: Snapshot = {}

@Store('SnapshotTrackStore')
export class SnapshotTrackStore {
  @observable version: number = 0;

  public forward() {
    this.update(this.version + 1)
  }
  public back() {
    this.update(this.version - 1)
  }

  @action.bound 
  private update(count: number) {
    this.version = count
  }
}

@ViewModel('AppStore')
export class AppStore {
  @inject(ExoUtils) exoUtils: ExoUtils;
  @inject(DbManager) dbManager: DbManager;
  @inject(SnapshotTrackStore) trackStore: SnapshotTrackStore;
  @observable.shallow snapshotTrack = observable.array([], { deep: false });

  public init() {
    this.applySnapshot()
  }

  @action.bound
  public snap() {
    return getSnapshot()
  }

  @action.bound
  public plus() {
    this.trackStore.forward()
  }


  @action.bound
  public async storeSnapshot() {
    const snap = getSnapshot()
    await settingLf.setItem('yuyiAppStore', snap)
  }

  @action.bound
  public async clearSnapshot(sync: boolean = false) {
    await settingLf.removeItem('yuyiAppStore')
    if (sync) {
      applySnapshot(defaultSnapshot)
    }
  }


  @action.bound setSnapListener() {
    if (staticReactional) {
      staticReactional()
    }
    staticReactional = onSnapshot(snap => {
      if(!Utils.isEqual(snap, this.snapshotTrack[this.snapshotTrack.length])) {
        runInAction(() => this.snapshotTrack.push(snap))
      }
      console.log('onSnap', this, snap)
    })
    return staticReactional
  }

  @action.bound
  public async applySnapshot() {
    const snap = await settingLf.getItem('yuyiAppStore')
    console.log('yuyiAppStore', snap)
    this.setSnapListener()
    applySnapshot(snap || {})
  }
}

export const store = new AppStore()
store.init()
declare global {
  interface Window {
    global_store: AppStore;
    global_db: DbManager;
  }
}
window.global_db = store.dbManager
window.global_store = store