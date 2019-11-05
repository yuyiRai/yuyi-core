
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
// import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
// import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import * as React from 'react';
import AutoSizer, { AutoSizerProps } from 'react-virtualized-auto-sizer';
import Tree, { VariableSizeNodeComponentProps, VariableSizeNodeData } from 'react-vtree/dist/lib/VariableSizeTree';
import { ListChildComponentProps } from 'react-window';

// import StarBorder from '@material-ui/icons/StarBorder';


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

  if (depth === 3) {
    return node;
  }

  // tslint:disable-next-line:increment-decrement
  for (let i = 0; i < 3; i++) {
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
    root: ({ style: { height, ...style }, data }: ITreeNodeProps) => {
      const paddingLeft = data.nestingLevel * 10 + (data.isLeaf ? 48 : 0)
      return ({
        ...style,
        display: 'flex',
        alignItems: 'center',
        marginBottom: theme.spacing(0),
        transition: 'height 0.3s linear, top 0.3s linear',
        paddingLeft,
        // width: `calc(100% - ${marginLeft}px);`
      })
    },
    rightIcon: {}
  }),
);

const Node: React.FunctionComponent<ITreeNodeProps> = (props) => {
  const {
    height,
    data: { isLeaf, name, id },
    isOpen,
    resize,
    style,
    toggle,
    treeData: { itemSize = undefined, selectedId = undefined, onSelect = undefined } = {},
  } = props
  const canOpen = height <= itemSize;
  const halfSize = itemSize / 2;
  const classes = useTreeNodeStyle(props)
  const toggleNodeSize = React.useCallback(
    () => resize(canOpen ? height + halfSize : height - halfSize, true),
    [height, resize],
  );
  const [current, setC] = React.useState(0)
  const [currentT, setT] = React.useState(0)
  React.useEffect(() => {
    setC(height)
    setT(parseInt(style.top as any))
  }, [])

  return (
    <ListItem 
      className={classes.root}
      key={id}
      style={{ height: current + 'px', top: currentT + 'px' }}
      selected={selectedId === id}
      button={false}
    >
      {!isLeaf && <IconButton onClick={toggle}>{!isOpen ? <ExpandLess /> : <ExpandMore />}</IconButton>}
      <ListItemIcon>
        <InboxIcon />
      </ListItemIcon>
      <ListItemText primary={name} />
      <Checkbox
        key="checkbox"
        className={classes.rightIcon}
        edge="end"
        onChange={() => onSelect && onSelect(id)}
        checked={selectedId === id}
        inputProps={{ 'aria-labelledby': id }}
      />
      <IconButton onClick={() => toggleNodeSize()}>
        <SendIcon />
      </IconButton>
    </ListItem>
  )
};

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
  return (
    <Node
      {...records[order[index]]}
      style={style}
      isScrolling={isScrolling}
      treeData={treeData}
    />
  )
}

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
        initialScrollOffset={200}
        estimatedItemSize={5}
        rowComponent={HackRowFunction}
      >
        {Node}
      </Tree>
    )
  }, [itemSize, onSelect, selectedId])

  return (
    <AutoSizer disableWidth>{TreeRender}</AutoSizer>
  );
};

export default function E() {
  return (
    <TreePresenter itemSize={50} />
  );
}