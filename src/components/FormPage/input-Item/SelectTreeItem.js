/* eslint-disable */
import EventEmitter from '@/utils/EventEmitter.js'
import { filter, pluck, tap, delay, distinctUntilChanged, map, debounceTime, mergeMap } from 'rxjs/operators';
import { merge, of } from 'rxjs';
import Utils from '../../../utils/Utils';
import { observer } from 'mobx-vue'


export default observer({
  name: 'SelectTreeItem',
  props: {
    // 控件id
    inputKey: String,
    // 接收绑定参数
    value: String,
    // 输入框宽度
    width: String,
    // 选项数据
    options: {
      type: Array,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    }, // 是否可用
    readOnly: {
      type: Boolean,
      default: false,
    }, // 是否只读
    useFilter: {
      type: Boolean,
      default: true,
    }, // 是否开启过滤选择
    // 输入框占位符
    placeholder: {
      type: String,
      required: false,
      default: '请选择',
    },
    // 树节点配置选项
    props: {
      type: Object,
      required: false,
      default: () => ({
        parent: 'parentId', // 顶层Id
        value: 'rowGuid',
        label: 'areaName',
        children: 'children',
        nodeCode: 'areaDto'
      }),
    },
  },
  // 设置绑定参数
  model: {
    prop: 'value',
    event: 'selected',
  },
  inject: {
    onItemOptionsChangeEmit: {
      type: EventEmitter,
      default: () => new EventEmitter()
    },
    onItemChangeEmit: {
      type: EventEmitter,
      default: () => new EventEmitter()
    },
  },
  computed: {
    // 是否为树状结构数据
    dataType() {
      return this.options.some(option=>option[this.props.children || 'children'] !== undefined)
    },
    // 若非树状结构，则转化为树状结构数据
    data() {
      return this.dataType ? this.options : this.switchTree();
    },
  },
  watch: {
    value(value) {
      this.onItemChangeEmit.emit({ value, code: this.inputKey, options: this.options, source:'value' })
    },
    options: {
      handler(options) {
        console.log('options update', options)
        this.onItemOptionsChangeEmit.emit({ options, code: this.inputKey, value: this.value, source:'options'  })
      },
      deep: true
    }
  },
  data() {
    return {
      // 树状菜单显示状态
      showStatus: false,
      // 菜单宽度
      treeWidth: 'auto',
      // 输入框显示值
      labelModel: '',
      // 实际请求传值
      valueModel: '',
      // 是否正在读取数据
      loading: false
    };
  },
  beforeDestroy () {
    this.sub.unsubscribe()
  },
  created() {
    this.sub = merge(
      of(this).pipe(
        map( ({value, inputKey: code, options}) => ({value, code, options}) )
      ),
      this.onItemOptionsChangeEmit,
      this.onItemChangeEmit
    ).pipe(
      filter(({code, value, source})=>code === this.inputKey && !Utils.isNil(value)),
      distinctUntilChanged((x, y) => x.code === y.code && x.value === y.value && x.options === y.options),
      tap(({value})=>{
        // console.log(value)
        this.loading = true
        this.$emit('selected', value)
      }),
      delay(0),
      tap(({value, source, options})=>{
        // console.log(value, source)
        if(Utils.isNotEmptyString(value)){
          // 检测输入框原有值并显示对应 label
          // 取节点配置
          const { label: labelKey } = this.props;
          // 查找节点
          const node = this.queryTree(this.data, value, true);
          // 取该节点数据
          const { [labelKey]: label } = node
          this.labelModel = label
          this.valueModel = value;
        } else {
          this.labelModel = ''
          this.valueModel = '';
        }
        if(source==='clear'){
          this.$emit('selected', this.valueModel);
        }
      }),
      debounceTime(5),
      tap(({value})=> this.$refs.tree.setCurrentKey(value)),
      delay(5)
    ).subscribe(()=>{
      this.loading = false
    })
    // 获取输入框宽度同步至树状菜单宽度
    this.$nextTick(() => {
      this.treeWidth = `${(this.width || this.$refs.input.$refs.input.clientWidth) - 24}px`;
    });
  },
  methods: {
    async clear(){
      this.isClearStatus = true
      this.onItemChangeEmit.emit({ value: '', code: this.inputKey, options: this.options, source: 'clear' })
      this.isClearStatus = await Utils.waitingPromise(100, false)
      
      // console.log(await Utils.waitingPromise(1000, this.valueModel), true)
    },
    // 当改变输入框内容
    onLabelInput(label){
      this.$refs.tree.filter(label)
    },
    // 单击节点
    onClickNode(node) {
      const children = node[this.props.children || 'children']
      if(this.readOnly!==true && (!children || !(children instanceof Array) || children.length===0)) {
        this.labelModel = node[this.props.label];
        this.valueModel = node[this.props.value];
        this.onCloseTree();
      }
      this.$refs.tree.setCurrentKey(this.valueModel)
      this.$emit('change-with', node, this.props.nodeCode)
    },
    // 偏平数组转化为树状层级结构
    switchTree() {
      return this.cleanChildren(this.buildTree(this.options, '0'));
    },
    // 隐藏树状菜单
    onCloseTree() {
      this.$refs.popover.showPopper = false;
    },
    // 显示时触发
    onShowPopover(...a) {
      // console.log(this.isClearStatus)
      if(!this.isClearStatus) {
        this.$refs.popover.showPopper = true;
        this.showStatus = true
        // console.log(this.options)
      } else {
        this.showStatus = false
        this.$refs.popover.showPopper = false;
      }
      this.$refs.tree.filter(false)
    },
    // 隐藏时触发
    onHidePopover() {
      this.showStatus = false;
      this.$emit('selected', this.valueModel);
      this.$refs.tree.filter(false);
      this.labelModel = this.queryTree(this.data, this.valueModel);
    },
    // 树节点过滤方法
    filterNode(query, data) {
      if (!query) return true;
      return data[this.props.label].indexOf(query) !== -1;
    },
    // 搜索树状数据中的 ID
    queryTree(tree, id, isNodeObject = false) {
      let stark = [];
      stark = stark.concat(tree);
      while (stark.length) {
        const temp = stark.shift();
        if (temp[this.props.children]) {
          stark = stark.concat(temp[this.props.children]);
        }
        if (temp[this.props.value] === id) {
          return isNodeObject ? temp : temp[this.props.label];
        }
      }
      return '';
    },
    // 将一维的扁平数组转换为多层级对象
    buildTree(data, id = '0') {
      const fa = (parentId) => {
        const temp = [];
        for (let i = 0; i < data.length; i++) {
          const n = data[i];
          if (n[this.props.parent] === parentId) {
            n.children = fa(n.rowGuid);
            temp.push(n);
          }
        }
        return temp;
      };
      return fa(id);
    },
    // 清除空 children项
    cleanChildren(data) {
      const fa = (list) => {
        list.map((e) => {
          if (e.children.length) {
            fa(e.children);
          } else {
            delete e.children;
          }
          return e;
        });
        return list;
      };
      return fa(data);
    },
  },
});