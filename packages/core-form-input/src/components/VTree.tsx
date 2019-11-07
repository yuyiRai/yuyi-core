
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
// import Collapse from '@material-ui/core/Collapse';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
// import DraftsIcon from '@material-ui/icons/Drafts';
// import SendIcon from '@material-ui/icons/Send';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import InboxIcon from '@material-ui/icons/MoveToInbox';
// import debounce from 'lodash/debounce'
import * as React from 'react';
import AutoSizer, { AutoSizerProps } from 'react-virtualized-auto-sizer';
import Tree, { VariableSizeNodeComponentProps, VariableSizeNodeData } from 'react-vtree/dist/es/VariableSizeTree';
import { ListChildComponentProps } from 'react-window';
import { Reducer } from 'react';

// import StarBorder from '@material-ui/icons/StarBorder';

const Collapse = React.lazy(() => import('@material-ui/core/Collapse'))

type DataNode = {
  children: DataNode[];
  childrenIds: string[];
  childrenIdsMap: { [id: string]: DataNode };
  id: string;
  name: string;
};

type StackElement = {
  nestingLevel: number;
  node: DataNode;
};

type ExtendedData = {
  readonly id: string;
  readonly isLeaf: boolean;
  readonly name: string;
  readonly nestingLevel: number;
  children: DataNode[];
  childrenIds: string[];
  childrenIdsMap: { [id: string]: DataNode };
};

let nodeId = 0;

const createNode = (depth: number = 0) => {
  const node: DataNode = {
    children: [],
    childrenIds: [],
    childrenIdsMap: { },
    id: nodeId.toString(),
    name: `test-${nodeId}`,
  };

  nodeId += 1;

  if (depth === 2) {
    return node;
  }

  // tslint:disable-next-line:increment-decrement
  for (let i = 0; i < 2; i++) {
    const childNode = createNode(depth + 1)
    node.children.push(childNode);
    node.childrenIds.push(childNode.id);
    node.childrenIdsMap[childNode.id] = childNode;
  }

  return node;
};

const rootNode = createNode();


interface ITreeNodeProps extends Omit<VariableSizeNodeComponentProps<ExtendedData>, 'data'> {
  data: ExtendedData
}
const useTreeNodeStyle = makeStyles((theme: Theme) =>
  createStyles({
    root: ({ style = {}, data, isScrolling }: ITreeNodeProps) => {
      const paddingLeft = (data.nestingLevel) * 10 + (data.isLeaf ? 48 : 0)
      return ({
        ...style,
        padding: 0,
        paddingLeft,
        height: isScrolling ? undefined : style.height,
        width: `calc(100% - ${paddingLeft}px);`
      })
    },
    base: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: theme.spacing(0),
      transition: 'height 0.3s linear, top 0.3s linear, opacity 0.3s linear',
    }
  }),
);

const lazyCollapse: Reducer<'collapsing' | 'collapsed' | 'collapse', 'toggleStart' | 'toggleEnd'> = (prevState, action) => {
  switch(action) {
    case 'toggleStart': return 'collapsing'
    case 'toggleEnd': return 'collapsed'
  }
  return 'collapse'
}

const Node: React.FunctionComponent<ITreeNodeProps> = (props) => {
  const {
    height,
    data: { isLeaf, name, id },
    isOpen,
    resize,
    toggle,
    treeData: { itemSize = undefined, selectedId = undefined, onSelect = undefined } = {}
  } = props
  const toggleNodeSize = React.useCallback(
    () => {
      const canOpen = height <= itemSize;
      const halfSize = itemSize / 2;
      resize(canOpen ? height + halfSize : height - halfSize, true)
    },
    [height, resize],
  );
  const classes = useTreeNodeStyle(props)
  // const [collapsed] = useDelayEffect(false, true, 100)
  // const [collapseStatus, action] = React.useReducer(lazyCollapse, 'collapse')
  const toggleCollapse = React.useCallback(function() {
    // action('toggleStart')
    setTimeout(() => {
      toggle()
    }, 500);
  }, [toggle])
  const toggleItem = React.useMemo(() => {
    return !isLeaf && <IconButton onClick={toggleCollapse}>{!isOpen ? <ExpandLess /> : <ExpandMore />}</IconButton>
  }, [isLeaf, toggle, isOpen])
  const selectStatus = React.useMemo(() => {
    return <Checkbox
      key="checkbox"
      edge="end"
      onChange={() => onSelect && onSelect(id)}
      checked={selectedId === id}
      inputProps={{ 'aria-labelledby': id }}
    />
  }, [onSelect, selectedId, id])
  const item = (
    <ListItem
      // style={{ height: current + 'px' }}
      onDoubleClick={toggleNodeSize}
      selected={selectedId === id}
    >
      {toggleItem}
      <ListItemIcon>
        <InboxIcon />
      </ListItemIcon>
      <ListItemText primary={name} />
      {selectStatus}
      {/* <IconButton onClick={() => toggleNodeSize()}>
          <SendIcon />
        </IconButton> */}
    </ListItem>
  )
  return (
    <List key={id} className={[classes.root, classes.base].join(' ')}>
      {item}
      <AutoCollapsedBox mode={isOpen ? 'out' : 'in'} afterToggle={() => {
        console.log('auto collapose')
      }}>
        123456
      </AutoCollapsedBox>
    </List>
  )
};

const AutoCollapsedBox = (props: {
  children: any;
  mode: 'in' | 'out',
  afterToggle: any
}) => {
  const { mode, afterToggle, children } = props
  const [display, setDisplay] = React.useState(false)
  const [show] = useDelayEffect(mode !== 'in', mode === 'in', 10);
  React.useEffect(() => {
    setDisplay(true)
  }, [mode])
  const after = React.useCallback(() => {
    afterToggle()
    setTimeout(() => {
      setDisplay(v => !v)
    }, 0);
  }, [afterToggle])
  return (
    <Collapse in={show}
      mountOnEnter={false}
      timeout={300}
      unmountOnExit={false}
      onExited={after}
      onEntered={after}
    >
      <div style={{ height: '500px' }}>
        {children}
      </div>
    </Collapse>
  )
}

interface TreePresenterProps {
  itemSize: number;
}

const HackRowFunction = ({
  index,
  data: { component: Node, treeData, order, records }, // tslint:disable-line:naming-convention
  style,
  isScrolling,
}: ListChildComponentProps) => {
  // console.log(records[order[index]], treeData)
  const { data, ...o } = records[order[index]] || {}
  return (
    <Node
      data={data}
      {...o}
      style={style}
      isScrolling={isScrolling}
      treeData={treeData}
    />
  )
}

export function useDelayEffect<I, N = I>(initial: I, next: N, delayTime = 0) {
  const [current, setC] = React.useState<I | N>(initial)
  // const [currentT, setT] = React.useState(parseInt(props.style.top as any))
  React.useEffect(() => {
    const r = setTimeout(() => {
      setC(next)
      // setT(parseInt(props.style.top as any))
    }, delayTime);
    return () => clearTimeout(r)
  }, [])
  return [current, setC] as [I | N, typeof setC]
}

export const InnerType = React.memo((props: any) => {
  const [show] = useDelayEffect(false, true, 1000)
  // console.log(props.children)
  return (
    <div style={props.style}>
      <Collapse in={show} style={{
        position: 'relative'
      }} mountOnEnter={false} timeout={300} unmountOnExit={false}>
        <div style={{height: '500px'}}>
          {props.children}
        </div>
      </Collapse>
    </div>
  )
})

const TreePresenter: React.FunctionComponent<TreePresenterProps> = ({
  itemSize,
}) => {
  const tree = React.useRef<Tree<ExtendedData>>(null);
  const [selectedId, onSelect] = React.useState()

  const treeWalker = React.useCallback(
    function* (
      refresh: boolean,
    ): IterableIterator<VariableSizeNodeData<ExtendedData> | string | symbol> {
      const stack: StackElement[] = [];

      stack.push({
        nestingLevel: 0,
        node: rootNode,
      });

      while (stack.length !== 0 && stack.length < 30) {
        const { node, nestingLevel } = stack.pop()!;
        const id = node.id;

        const isOpened = yield refresh
          ? {
            defaultHeight: itemSize,
            id,
            isLeaf: node.children.length === 0,
            isOpenByDefault: true,
            name: node.name,
            nestingLevel,
            childrenIds: node.childrenIds,
            children: node.children,
            childrenIdsMap: node.childrenIdsMap
          }
          : id;

        if (node.children.length !== 0 && isOpened) {
          // tslint:disable-next-line:increment-decrement
          for (let i = node.children.length - 1; i >= 0; i--) {
            stack.push({
              nestingLevel: nestingLevel + 1,
              node: node.children[i],
            });
          }
        }
      }
    },
    [itemSize],
  );

  React.useEffect(() => {
    if (tree.current) {
      tree.current!.recomputeTree({ refreshNodes: true, useDefaultHeight: true });
    }
  }, [itemSize]);

  const TreeRender = React.useMemo<AutoSizerProps['children']>(() => {
    return ({ height }) => (
      <Tree<ExtendedData>
        ref={tree}
        itemData={{ itemSize, selectedId, onSelect }}
        treeWalker={treeWalker}
        height={height}
        width={500}
        initialScrollOffset={0}
        estimatedItemSize={5}
        useIsScrolling={false}
        overscanCount={5}
        rowComponent={HackRowFunction}
        innerElementType={InnerType}
      >
        {Node}
      </Tree>
    )
  }, [itemSize, onSelect, selectedId])

  return (
    <AutoSizer defaultWidth={500} disableWidth>{TreeRender}</AutoSizer>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
    nested: {
      paddingLeft: theme.spacing(4),
    },
  }),
);

export function NestedList() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <div>
      <IconButton onClick={handleClick}>{open ? <ExpandLess /> : <ExpandMore />}</IconButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem button className={classes.nested}>
            <ListItemIcon>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText primary="Starred" />
          </ListItem>
        </List>
      </Collapse>
    </div>
    )
}
export default function E() {
  
  return (
    <>
      {/* <NestedList /> */}
      <TreePresenter itemSize={50} />
    </>
  );
}