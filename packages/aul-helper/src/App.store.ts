import { ViewModel, inject, onSnapshot, getSnapshot, applySnapshot, Store } from "mmlpx";
import { ExoUtils } from "./utils/ExoUtils";
import { DbManager } from "./DAT";
import { settingLf } from "./utils/Setting";
import { IReactionDisposer, observable, action, runInAction } from "mobx";
import { Snapshot } from "mmlpx/esm/core/dependency-inject/Injector";
import { Utils } from "@yuyi/utils";
import { FileLoader } from "./components/DragUpload";

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

  @action
  private update(count: number) {
    this.version = count
  }
}

@ViewModel('AppStore')
export class AppStore {
  @inject(ExoUtils) exoUtils: ExoUtils;
  // @inject(DbManager) dbManager: DbManager;
  fileLoader: FileLoader = new FileLoader();
  @inject(SnapshotTrackStore) trackStore: SnapshotTrackStore;
  @observable.shallow snapshotTrack = observable.array([], { deep: false });

  public init() {
    this.applySnapshot()
  }

  @action
  public snap() {
    return getSnapshot()
  }

  @action
  public plus() {
    this.trackStore.forward()
  }


  @action
  public async storeSnapshot(path?: string) {
    const snap = getSnapshot()
    if (Utils.isString(path)) {
      const item = (await settingLf.getItem<any>('yuyiAppStore')) || {}
      Utils.set(item, path, Utils.get(snap, path))
      await settingLf.setItem('yuyiAppStore', item)
    } else {
      await settingLf.setItem('yuyiAppStore', snap)
    }
  }

  @action
  public async clearSnapshot(sync: boolean = false) {
    await settingLf.removeItem('yuyiAppStore')
    if (sync) {
      applySnapshot(defaultSnapshot)
    }
  }


  @action setSnapListener() {
    if (staticReactional) {
      staticReactional()
    }
    staticReactional = onSnapshot(snap => {
      if (!Utils.isEqual(snap, this.snapshotTrack[this.snapshotTrack.length])) {
        runInAction(() => this.snapshotTrack.push(snap))
      }
      console.log('onSnap', this, snap)
    })
    return staticReactional
  }

  @action
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
// window.global_db = store.dbManager
window.global_store = store